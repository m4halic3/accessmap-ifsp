package br.edu.ifsp.accessmap.servico;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.accessmap.dominio.Espaco;
import br.edu.ifsp.accessmap.dominio.Planta;
import br.edu.ifsp.accessmap.dominio.PlantaVersao;
import br.edu.ifsp.accessmap.dto.PlantaDto;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.PlantaVersaoRepositorio;

/**
 * Imagens de planta enviadas pelo administrador. Para cada planta ficam
 * guardadas no máximo duas versões: a que está em uso e a anterior (para
 * desfazer), como na v1. Sem versões, o mapa usa a imagem original do pacote
 * do espaço (espacos/<slug>/espaco.json).
 */
@Service
public class PlantaServico {

    public static final long TAMANHO_MAXIMO = 25L * 1024 * 1024;
    private static final int LADO_MINIMO = 300;
    private static final int LADO_MAXIMO = 30000;

    private final PlantaVersaoRepositorio versoes;
    private final AdministradorRepositorio administradores;
    private final EspacoServico espacoServico;

    public PlantaServico(PlantaVersaoRepositorio versoes, AdministradorRepositorio administradores,
                         EspacoServico espacoServico) {
        this.versoes = versoes;
        this.administradores = administradores;
        this.espacoServico = espacoServico;
    }

    @Transactional(readOnly = true)
    public List<PlantaDto> listar(Espaco espaco) {
        return espacoServico.plantas(espaco).stream().map(this::montar).flatMap(Optional::stream).toList();
    }

    @Transactional(readOnly = true)
    public PlantaDto buscar(Espaco espaco, String codigo) {
        return montar(planta(espaco, codigo)).orElseThrow(() ->
                RegraNegocioException.naoEncontrado("Esta planta está com a imagem original do projeto."));
    }

    @Transactional(readOnly = true)
    public PlantaVersao arquivo(Integer id) {
        return versoes.findById(id).orElseThrow(() -> RegraNegocioException.naoEncontrado("Imagem não encontrada."));
    }

    @Transactional
    public PlantaDto publicar(Espaco espaco, String codigo, MultipartFile arquivo, int largura, int altura,
                              String alt, Integer adminId) {
        Planta planta = planta(espaco, codigo);
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

        versoes.save(new PlantaVersao(planta, administradores.getReferenceById(adminId),
                nome, tipoMime, conteudo, largura, altura, textoAlt));
        versoes.flush();

        // Mantém só a nova e a imediatamente anterior
        List<PlantaVersaoRepositorio.Resumo> lista = versoes.findByPlantaIdOrderByIdDesc(planta.getId());
        if (lista.size() > 2) {
            versoes.excluirAnterioresA(planta.getId(), lista.get(1).getId());
        }
        return montar(planta).orElseThrow();
    }

    /** Descarta a imagem em uso; volta a anterior (ou a original do projeto). */
    @Transactional
    public Optional<PlantaDto> voltarAnterior(Espaco espaco, String codigo) {
        Planta planta = planta(espaco, codigo);
        List<PlantaVersaoRepositorio.Resumo> lista = versoes.findByPlantaIdOrderByIdDesc(planta.getId());
        if (lista.isEmpty()) {
            throw RegraNegocioException.conflito("Não há versão anterior guardada para este mapa.");
        }
        versoes.excluirPorId(lista.get(0).getId());
        return montar(planta);
    }

    /** Remove as imagens enviadas e o histórico: volta a imagem original do projeto. */
    @Transactional
    public void restaurarOriginal(Espaco espaco, String codigo) {
        versoes.excluirPorPlanta(planta(espaco, codigo).getId());
    }

    private Planta planta(Espaco espaco, String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw RegraNegocioException.naoEncontrado("Informe a planta.");
        }
        return espacoServico.planta(espaco, codigo);
    }

    private Optional<PlantaDto> montar(Planta planta) {
        List<PlantaVersaoRepositorio.Resumo> lista = versoes.findByPlantaIdOrderByIdDesc(planta.getId());
        if (lista.isEmpty()) return Optional.empty();

        PlantaVersaoRepositorio.Resumo atual = lista.get(0);
        PlantaDto.Anterior anterior = lista.size() > 1
                ? new PlantaDto.Anterior(null, lista.get(1).getNomeArquivo(),
                        comFuso(lista.get(1).getCriadoEm()), urlArquivo(lista.get(1).getId()))
                : PlantaDto.Anterior.imagemOriginal();

        return Optional.of(new PlantaDto(planta.getCodigo(), atual.getId(), atual.getNomeArquivo(), atual.getLargura(),
                atual.getAltura(), atual.getTextoAlternativo(), comFuso(atual.getCriadoEm()),
                urlArquivo(atual.getId()), anterior));
    }

    private static String urlArquivo(Integer id) {
        return "/api/plantas/arquivos/" + id;
    }

    private static OffsetDateTime comFuso(LocalDateTime data) {
        return data.atZone(ZoneId.systemDefault()).toOffsetDateTime();
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
