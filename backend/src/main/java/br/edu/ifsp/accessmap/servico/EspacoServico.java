package br.edu.ifsp.accessmap.servico;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.edu.ifsp.accessmap.config.AccessmapProperties;
import br.edu.ifsp.accessmap.dominio.Area;
import br.edu.ifsp.accessmap.dominio.Espaco;
import br.edu.ifsp.accessmap.dominio.Planta;
import br.edu.ifsp.accessmap.dto.EspacoDto;
import br.edu.ifsp.accessmap.dto.EspacoResumoDto;
import br.edu.ifsp.accessmap.repositorio.AreaRepositorio;
import br.edu.ifsp.accessmap.repositorio.EspacoRepositorio;
import br.edu.ifsp.accessmap.repositorio.PlantaRepositorio;

/**
 * Espaços públicos atendidos por esta instalação.
 *
 * Cada espaço é um "pacote" na pasta espacos/&lt;slug&gt;/ do front-end:
 *   espaco.json  - nome, plantas, áreas (cores/ícones) e textos da interface
 *   locais.json  - lista original de locais (popula o banco na primeira vez)
 * A cada inicialização os pacotes são sincronizados com o banco: um pacote
 * novo vira um espaço novo, e mudanças no espaco.json (cores, textos...)
 * passam a valer. Pastas que começam com "_" (ex.: _modelo) são ignoradas.
 */
@Service
public class EspacoServico {

    private static final Logger log = LoggerFactory.getLogger(EspacoServico.class);

    private static final Pattern SLUG = Pattern.compile("[a-z0-9]+(-[a-z0-9]+)*");
    private static final Pattern CODIGO = Pattern.compile("[a-z0-9_]{1,40}");
    private static final Pattern COR = Pattern.compile("#[0-9A-Fa-f]{6}");
    private static final Pattern ICONE = Pattern.compile("fa-[a-z0-9-]{1,45}");

    private final EspacoRepositorio espacos;
    private final PlantaRepositorio plantas;
    private final AreaRepositorio areas;
    private final ObjectMapper objectMapper;
    private final AccessmapProperties props;

    public EspacoServico(EspacoRepositorio espacos, PlantaRepositorio plantas, AreaRepositorio areas,
                         ObjectMapper objectMapper, AccessmapProperties props) {
        this.espacos = espacos;
        this.plantas = plantas;
        this.areas = areas;
        this.objectMapper = objectMapper;
        this.props = props;
    }

    // ------------------------------------------------------------------
    // Consulta
    // ------------------------------------------------------------------

    /** Espaço pedido pela página (?espaco=slug) ou, sem slug, o espaço padrão. */
    @Transactional(readOnly = true)
    public Espaco resolver(String slug) {
        if (slug == null || slug.isBlank()) {
            return espacos.findFirstByPadraoTrueAndAtivoTrueOrderByIdAsc()
                    .or(() -> espacos.findByAtivoTrueOrderByNomeAsc().stream().findFirst())
                    .orElseThrow(() -> RegraNegocioException.naoEncontrado(
                            "Nenhum espaço cadastrado. Crie um pacote em espacos/<slug>/espaco.json."));
        }
        return espacos.findBySlug(slug.trim())
                .filter(Espaco::isAtivo)
                .orElseThrow(() -> RegraNegocioException.naoEncontrado("Espaço não encontrado: " + slug + "."));
    }

    @Transactional(readOnly = true)
    public List<EspacoResumoDto> listar() {
        return espacos.findByAtivoTrueOrderByNomeAsc().stream().map(EspacoResumoDto::de).toList();
    }

    /** Configuração completa do espaço, no mesmo formato do espaco.json. */
    @Transactional(readOnly = true)
    public EspacoDto configuracao(Espaco espaco) {
        EspacoDto.Extras extras = lerExtras(espaco);

        List<EspacoDto.PlantaInfo> listaPlantas = plantas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId()).stream()
                .map(p -> new EspacoDto.PlantaInfo(p.getCodigo(), p.getNome(), p.getRotuloCurto(), p.getDescricao(),
                        p.isPrincipal(), p.getAndarRotulo(), p.getBloco(), p.getPrefixoNome(), p.getLargura(),
                        p.getAltura(), p.getImagemUrl(), p.getHdUrl(), p.getProporcaoArte(), p.getTextoAlternativo()))
                .toList();

        List<EspacoDto.AreaInfo> listaAreas = areas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId()).stream()
                .map(a -> new EspacoDto.AreaInfo(a.getCodigo(), a.getRotulo(), a.getCor(), a.getIcone(),
                        a.getPredio(), a.getOQue(), a.isNaLegenda()))
                .toList();

        return new EspacoDto(espaco.getSlug(), espaco.getNome(), espaco.getTipo(), extras.genero(), espaco.getCidade(),
                espaco.isPadrao(), extras.textos(), extras.mapaLocalizacao(), extras.destaques(),
                listaPlantas, listaAreas);
    }

    /** Planta do espaço pelo código; sem código, a planta principal. */
    @Transactional(readOnly = true)
    public Planta planta(Espaco espaco, String codigo) {
        if (codigo == null || codigo.isBlank()) {
            List<Planta> lista = plantas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId());
            return lista.stream().filter(Planta::isPrincipal).findFirst()
                    .or(() -> lista.stream().findFirst())
                    .orElseThrow(() -> RegraNegocioException.naoEncontrado("Este espaço não tem plantas cadastradas."));
        }
        return plantas.findByEspacoIdAndCodigo(espaco.getId(), codigo.trim())
                .orElseThrow(() -> RegraNegocioException.naoEncontrado("Planta desconhecida: " + codigo + "."));
    }

    @Transactional(readOnly = true)
    public List<Planta> plantas(Espaco espaco) {
        return plantas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId());
    }

    @Transactional(readOnly = true)
    public boolean areaExiste(Espaco espaco, String codigo) {
        return areas.existsByEspacoIdAndCodigo(espaco.getId(), codigo);
    }

    /** Pasta do pacote do espaço (espacos/&lt;slug&gt;/). */
    public Path pastaDoPacote(Espaco espaco) {
        return pastaEspacos().resolve(espaco.getSlug());
    }

    private Path pastaEspacos() {
        return props.pastaFrontend().resolve("espacos");
    }

    private EspacoDto.Extras lerExtras(Espaco espaco) {
        if (espaco.getConfiguracao() == null || espaco.getConfiguracao().isBlank()) {
            return new EspacoDto.Extras(null, Map.of(), null, List.of());
        }
        try {
            return objectMapper.readValue(espaco.getConfiguracao(), EspacoDto.Extras.class);
        } catch (JsonProcessingException e) {
            log.warn("Configuração inválida no espaço {}: {}", espaco.getSlug(), e.getOriginalMessage());
            return new EspacoDto.Extras(null, Map.of(), null, List.of());
        }
    }

    // ------------------------------------------------------------------
    // Sincronização dos pacotes (espacos/<slug>/espaco.json)
    // ------------------------------------------------------------------

    /**
     * Lê todos os pacotes e grava espaços, plantas e áreas no banco.
     * Devolve os espaços sincronizados. Um pacote inválido interrompe a
     * inicialização com uma mensagem clara (melhor do que um mapa quebrado).
     */
    @Transactional
    public List<Espaco> sincronizarPacotes() {
        Path pasta = pastaEspacos();
        if (!Files.isDirectory(pasta)) {
            log.warn("Pasta de espaços não encontrada: {}", pasta);
            return List.of();
        }

        List<Path> pacotes;
        try (Stream<Path> itens = Files.list(pasta)) {
            pacotes = itens
                    .filter(Files::isDirectory)
                    .filter(p -> !p.getFileName().toString().startsWith("_") && !p.getFileName().toString().startsWith("."))
                    .filter(p -> Files.isRegularFile(p.resolve("espaco.json")))
                    .sorted()
                    .toList();
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível ler a pasta de espaços " + pasta, e);
        }

        List<Espaco> sincronizados = new ArrayList<>();
        for (Path pacote : pacotes) {
            sincronizados.add(sincronizar(pacote));
        }
        garantirUmPadrao(sincronizados);
        return sincronizados;
    }

    private Espaco sincronizar(Path pacote) {
        String slug = pacote.getFileName().toString();
        Path arquivo = pacote.resolve("espaco.json");
        EspacoDto dados;
        try {
            dados = objectMapper.readValue(Files.readString(arquivo), EspacoDto.class);
        } catch (IOException e) {
            throw new IllegalStateException("Arquivo inválido: " + arquivo + " — " + e.getMessage(), e);
        }
        validar(slug, dados, arquivo);

        Espaco espaco = espacos.findBySlug(slug).orElseGet(() -> {
            log.info("Novo espaço encontrado: {}", slug);
            return new Espaco(slug);
        });
        espaco.setNome(dados.nome().trim());
        espaco.setTipo(dados.tipo() != null && !dados.tipo().isBlank() ? dados.tipo().trim() : "local");
        espaco.setCidade(dados.cidade());
        espaco.setPadrao(Boolean.TRUE.equals(dados.padrao()));
        try {
            espaco.setConfiguracao(objectMapper.writeValueAsString(new EspacoDto.Extras(
                    "f".equals(dados.genero()) || "m".equals(dados.genero()) ? dados.genero() : null,
                    dados.textos() != null ? dados.textos() : Map.of(),
                    dados.mapaLocalizacao(),
                    dados.destaques() != null ? dados.destaques() : List.of())));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
        espaco = espacos.save(espaco);

        sincronizarPlantas(espaco, dados.plantas());
        sincronizarAreas(espaco, dados.areas() != null ? dados.areas() : List.of());
        return espaco;
    }

    private void sincronizarPlantas(Espaco espaco, List<EspacoDto.PlantaInfo> lista) {
        boolean temPrincipal = lista.stream().anyMatch(p -> Boolean.TRUE.equals(p.principal()));
        int ordem = 0;
        for (EspacoDto.PlantaInfo info : lista) {
            Planta planta = plantas.findByEspacoIdAndCodigo(espaco.getId(), info.codigo())
                    .orElseGet(() -> new Planta(espaco, info.codigo()));
            planta.setNome(info.nome().trim());
            planta.setRotuloCurto(info.rotuloCurto() != null ? info.rotuloCurto().trim() : info.nome().trim());
            planta.setDescricao(info.descricao() != null ? info.descricao().trim() : info.nome().trim());
            // Sem nenhuma marcada como principal, a primeira é a principal
            planta.setPrincipal(temPrincipal ? Boolean.TRUE.equals(info.principal()) : ordem == 0);
            planta.setAndarRotulo(vazioParaNulo(info.andar()));
            planta.setBloco(vazioParaNulo(info.bloco()));
            planta.setPrefixoNome(vazioParaNulo(info.prefixoNome()));
            planta.setLargura(info.largura());
            planta.setAltura(info.altura());
            planta.setImagemUrl(info.imagem().trim());
            planta.setHdUrl(vazioParaNulo(info.hd()));
            planta.setProporcaoArte(info.proporcaoArte());
            planta.setTextoAlternativo(vazioParaNulo(info.alt()));
            planta.setOrdem(ordem++);
            plantas.save(planta);
        }
        // Plantas que saíram do pacote não são apagadas: podem ter locais ligados a elas
        Set<String> codigos = new HashSet<>(lista.stream().map(EspacoDto.PlantaInfo::codigo).toList());
        plantas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId()).stream()
                .filter(p -> !codigos.contains(p.getCodigo()))
                .forEach(p -> log.warn("A planta \"{}\" do espaço {} não está mais no espaco.json, mas foi mantida no banco.",
                        p.getCodigo(), espaco.getSlug()));
    }

    private void sincronizarAreas(Espaco espaco, List<EspacoDto.AreaInfo> lista) {
        Set<String> codigos = new HashSet<>();
        int ordem = 0;
        for (EspacoDto.AreaInfo info : lista) {
            codigos.add(info.codigo());
            Area area = areas.findByEspacoIdAndCodigo(espaco.getId(), info.codigo())
                    .orElseGet(() -> new Area(espaco, info.codigo()));
            area.setRotulo(info.rotulo().trim());
            area.setCor(info.cor());
            area.setIcone(info.icone());
            area.setPredio(vazioParaNulo(info.predio()));
            area.setOQue(vazioParaNulo(info.oQue()));
            area.setNaLegenda(!Boolean.FALSE.equals(info.naLegenda()));
            area.setOrdem(ordem++);
            areas.save(area);
        }
        // Áreas não têm chave estrangeira: as que saíram do pacote podem ser removidas
        areas.findByEspacoIdOrderByOrdemAscIdAsc(espaco.getId()).stream()
                .filter(a -> !codigos.contains(a.getCodigo()))
                .forEach(areas::delete);
    }

    /** Exatamente um espaço padrão: o primeiro marcado, ou o primeiro de todos. */
    private void garantirUmPadrao(List<Espaco> sincronizados) {
        List<Espaco> todos = espacos.findAll();
        if (todos.isEmpty()) return;
        Optional<Espaco> escolhido = todos.stream().filter(Espaco::isPadrao).filter(Espaco::isAtivo).findFirst();
        Espaco padrao = escolhido.orElse(sincronizados.isEmpty() ? todos.get(0) : sincronizados.get(0));
        for (Espaco e : todos) {
            boolean deveSer = e.getId().equals(padrao.getId());
            if (e.isPadrao() != deveSer) {
                e.setPadrao(deveSer);
                espacos.save(e);
            }
        }
    }

    private static void validar(String slug, EspacoDto d, Path arquivo) {
        List<String> erros = new ArrayList<>();
        if (!SLUG.matcher(slug).matches()) {
            erros.add("o nome da pasta deve ter só letras minúsculas, números e hífens (ex.: prefeitura-centro)");
        }
        if (d.slug() != null && !d.slug().equals(slug)) {
            erros.add("\"slug\" (" + d.slug() + ") deve ser igual ao nome da pasta (" + slug + ")");
        }
        if (d.nome() == null || d.nome().isBlank()) erros.add("informe \"nome\"");
        if (d.genero() != null && !d.genero().equals("m") && !d.genero().equals("f")) {
            erros.add("\"genero\" deve ser \"m\" ou \"f\"");
        }
        if (d.plantas() == null || d.plantas().isEmpty()) {
            erros.add("informe pelo menos uma planta em \"plantas\"");
        } else {
            Set<String> vistos = new HashSet<>();
            for (EspacoDto.PlantaInfo p : d.plantas()) {
                String rotulo = "planta \"" + p.codigo() + "\"";
                if (p.codigo() == null || !CODIGO.matcher(p.codigo()).matches()) {
                    erros.add(rotulo + ": \"codigo\" deve ter só letras minúsculas, números e _");
                } else if (!vistos.add(p.codigo())) {
                    erros.add(rotulo + ": código repetido");
                }
                if (p.nome() == null || p.nome().isBlank()) erros.add(rotulo + ": informe \"nome\"");
                if (p.imagem() == null || p.imagem().isBlank()) erros.add(rotulo + ": informe \"imagem\"");
                if (p.largura() == null || p.largura() < 100 || p.largura() > 5000
                        || p.altura() == null || p.altura() < 100 || p.altura() > 5000) {
                    erros.add(rotulo + ": \"largura\" e \"altura\" devem estar entre 100 e 5000");
                }
            }
            if (d.plantas().stream().filter(p -> Boolean.TRUE.equals(p.principal())).count() > 1) {
                erros.add("só uma planta pode ter \"principal\": true");
            }
        }
        if (d.areas() != null) {
            Set<String> vistos = new HashSet<>();
            for (EspacoDto.AreaInfo a : d.areas()) {
                String rotulo = "área \"" + a.codigo() + "\"";
                if (a.codigo() == null || !CODIGO.matcher(a.codigo()).matches()) {
                    erros.add(rotulo + ": \"codigo\" deve ter só letras minúsculas, números e _");
                } else if (!vistos.add(a.codigo())) {
                    erros.add(rotulo + ": código repetido");
                }
                if (a.rotulo() == null || a.rotulo().isBlank()) erros.add(rotulo + ": informe \"rotulo\"");
                if (a.cor() == null || !COR.matcher(a.cor()).matches()) erros.add(rotulo + ": \"cor\" deve ser como #1b6b3a");
                if (a.icone() == null || !ICONE.matcher(a.icone()).matches()) {
                    erros.add(rotulo + ": \"icone\" deve ser um ícone do Font Awesome, como fa-book");
                }
            }
            if (d.plantas() != null) {
                for (EspacoDto.PlantaInfo p : d.plantas()) {
                    if (p.bloco() != null && !p.bloco().isBlank() && !vistos.contains(p.bloco())) {
                        erros.add("planta \"" + p.codigo() + "\": \"bloco\" (" + p.bloco() + ") não é uma das áreas");
                    }
                }
            }
        }
        if (!erros.isEmpty()) {
            throw new IllegalStateException("Pacote de espaço inválido em " + arquivo + ":\n  - "
                    + String.join("\n  - ", erros));
        }
    }

    private static String vazioParaNulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
