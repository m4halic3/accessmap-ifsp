package br.edu.ifsp.accessmap.servico;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.accessmap.dominio.PlantaVersao;
import br.edu.ifsp.accessmap.dto.PlantaDto;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.PlantaRepositorio;

/**
 * Imagens de planta enviadas pelo administrador. Para cada ala ficam guardadas
 * no máximo duas versões: a que está em uso e a anterior (para desfazer),
 * como na v1. Sem versões, o mapa usa a imagem original do projeto.
 */
@Service
public class PlantaServico {

    public static final Set<String> ALAS = Set.of("todos", "edificacoes", "mecanica");
    private static final List<String> ORDEM_ALAS = List.of("todos", "edificacoes", "mecanica");

    public static final long TAMANHO_MAXIMO = 25L * 1024 * 1024;
    private static final int LADO_MINIMO = 300;
    private static final int LADO_MAXIMO = 30000;

    private final PlantaRepositorio plantas;
    private final AdministradorRepositorio administradores;

    public PlantaServico(PlantaRepositorio plantas, AdministradorRepositorio administradores) {
        this.plantas = plantas;
        this.administradores = administradores;
    }

    @Transactional(readOnly = true)
    public List<PlantaDto> listar() {
        return ORDEM_ALAS.stream().map(this::montar).flatMap(Optional::stream).toList();
    }

    @Transactional(readOnly = true)
    public PlantaDto buscar(String ala) {
        validarAla(ala);
        return montar(ala).orElseThrow(() ->
                RegraNegocioException.naoEncontrado("Esta planta está com a imagem original do projeto."));
    }

    @Transactional(readOnly = true)
    public PlantaVersao arquivo(Integer id) {
        return plantas.findById(id).orElseThrow(() -> RegraNegocioException.naoEncontrado("Imagem não encontrada."));
    }

    @Transactional
    public PlantaDto publicar(String ala, MultipartFile arquivo, int largura, int altura, String alt, Integer adminId) {
        validarAla(ala);
        if (arquivo == null || arquivo.isEmpty()) {
            throw RegraNegocioException.invalido("Escolha uma imagem antes de publicar.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new RegraNegocioException(HttpStatus.PAYLOAD_TOO_LARGE, "A imagem passa do limite de 25 MB.");
        }
        if (largura < LADO_MINIMO || altura < LADO_MINIMO || largura > LADO_MAXIMO || altura > LADO_MAXIMO) {
            throw RegraNegocioException.invalido("Use uma imagem de pelo menos " + LADO_MINIMO + "×" + LADO_MINIMO + " px.");
        }
        String textoAlt = alt == null || alt.isBlank() ? null : alt.trim();
        if (textoAlt != null && textoAlt.length() > 250) {
            throw RegraNegocioException.invalido("A descrição da imagem pode ter no máximo 250 caracteres.");
        }

        byte[] conteudo;
        try {
            conteudo = arquivo.getBytes();
        } catch (IOException e) {
            throw RegraNegocioException.invalido("Não foi possível ler a imagem enviada.");
        }
        // O tipo vem do conteúdo do arquivo (e não do que o navegador informou),
        // para nunca servir como imagem algo que não é imagem
        String tipoMime = detectarTipo(conteudo);
        if (tipoMime == null) {
            throw RegraNegocioException.invalido("Formato não aceito. Envie uma imagem PNG, JPG ou WEBP.");
        }

        String nome = Objects.requireNonNullElse(arquivo.getOriginalFilename(), "planta").trim();
        if (nome.length() > 255) nome = nome.substring(nome.length() - 255);

        PlantaVersao nova = plantas.save(new PlantaVersao(ala, administradores.getReferenceById(adminId),
                nome, tipoMime, conteudo, largura, altura, textoAlt));
        plantas.flush();

        // Mantém só a nova e a imediatamente anterior
        List<PlantaRepositorio.Resumo> versoes = plantas.findByAlaOrderByIdDesc(ala);
        if (versoes.size() > 2) {
            plantas.excluirAnterioresA(ala, versoes.get(1).getId());
        }
        return montar(ala).orElseThrow();
    }

    /** Descarta a imagem em uso; volta a anterior (ou a original do projeto). */
    @Transactional
    public Optional<PlantaDto> voltarAnterior(String ala) {
        validarAla(ala);
        List<PlantaRepositorio.Resumo> versoes = plantas.findByAlaOrderByIdDesc(ala);
        if (versoes.isEmpty()) {
            throw RegraNegocioException.conflito("Não há versão anterior guardada para este mapa.");
        }
        plantas.excluirPorId(versoes.get(0).getId());
        return montar(ala);
    }

    /** Remove as imagens enviadas e o histórico: volta a imagem original do projeto. */
    @Transactional
    public void restaurarOriginal(String ala) {
        validarAla(ala);
        plantas.excluirPorAla(ala);
    }

    private Optional<PlantaDto> montar(String ala) {
        List<PlantaRepositorio.Resumo> versoes = plantas.findByAlaOrderByIdDesc(ala);
        if (versoes.isEmpty()) return Optional.empty();

        PlantaRepositorio.Resumo atual = versoes.get(0);
        PlantaDto.Anterior anterior = versoes.size() > 1
                ? new PlantaDto.Anterior(null, versoes.get(1).getNomeArquivo(),
                        comFuso(versoes.get(1).getCriadoEm()), urlArquivo(versoes.get(1).getId()))
                : PlantaDto.Anterior.imagemOriginal();

        return Optional.of(new PlantaDto(ala, atual.getId(), atual.getNomeArquivo(), atual.getLargura(),
                atual.getAltura(), atual.getTextoAlternativo(), comFuso(atual.getCriadoEm()),
                urlArquivo(atual.getId()), anterior));
    }

    private static String urlArquivo(Integer id) {
        return "/api/plantas/arquivos/" + id;
    }

    private static OffsetDateTime comFuso(LocalDateTime data) {
        return data.atZone(ZoneId.systemDefault()).toOffsetDateTime();
    }

    private static void validarAla(String ala) {
        if (!ALAS.contains(ala)) {
            throw RegraNegocioException.naoEncontrado("Planta desconhecida: " + ala + ".");
        }
    }

    /** Reconhece PNG, JPEG e WEBP pelos primeiros bytes do arquivo. */
    static String detectarTipo(byte[] b) {
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') {
            return "image/png";
        }
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return "image/webp";
        }
        return null;
    }
}
