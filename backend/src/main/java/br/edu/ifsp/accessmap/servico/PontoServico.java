package br.edu.ifsp.accessmap.servico;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.edu.ifsp.accessmap.dominio.CategoriaAcessibilidade;
import br.edu.ifsp.accessmap.dominio.Espaco;
import br.edu.ifsp.accessmap.dominio.Planta;
import br.edu.ifsp.accessmap.dominio.PontoAcessibilidade;
import br.edu.ifsp.accessmap.dto.PontoDto;
import br.edu.ifsp.accessmap.dto.PontoRequisicao;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.CategoriaRepositorio;
import br.edu.ifsp.accessmap.repositorio.PontoRepositorio;

/** Locais do mapa de cada espaço. */
@Service
public class PontoServico {

    private final PontoRepositorio pontos;
    private final CategoriaRepositorio categorias;
    private final AdministradorRepositorio administradores;
    private final EspacoServico espacoServico;
    private final ObjectMapper objectMapper;

    public PontoServico(PontoRepositorio pontos, CategoriaRepositorio categorias,
                        AdministradorRepositorio administradores, EspacoServico espacoServico,
                        ObjectMapper objectMapper) {
        this.pontos = pontos;
        this.categorias = categorias;
        this.administradores = administradores;
        this.espacoServico = espacoServico;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<PontoDto> listar(Espaco espaco) {
        return pontos.listarDoEspaco(espaco.getId()).stream().map(PontoDto::de).toList();
    }

    @Transactional
    public PontoDto criar(Espaco espaco, PontoRequisicao req, Integer adminId) {
        String nome = req.nome().trim();
        if (pontos.existsByEspacoIdAndNome(espaco.getId(), nome)) {
            throw nomeDuplicado(nome);
        }
        PontoAcessibilidade ponto = new PontoAcessibilidade();
        ponto.setEspaco(espaco);
        preencher(espaco, ponto, req, adminId);
        return PontoDto.de(pontos.save(ponto));
    }

    @Transactional
    public PontoDto atualizar(Espaco espaco, Integer id, PontoRequisicao req, Integer adminId) {
        PontoAcessibilidade ponto = buscar(espaco, id, "Este local não existe mais. Recarregue a página.");
        String nome = req.nome().trim();
        if (pontos.existsByEspacoIdAndNomeAndIdNot(espaco.getId(), nome, id)) {
            throw nomeDuplicado(nome);
        }
        preencher(espaco, ponto, req, adminId);
        return PontoDto.de(pontos.saveAndFlush(ponto));
    }

    @Transactional
    public void excluir(Espaco espaco, Integer id) {
        pontos.delete(buscar(espaco, id, "Este local já foi excluído."));
    }

    /** Apaga os locais do espaço e cadastra de novo a lista original do pacote. */
    @Transactional
    public List<PontoDto> restaurarOriginais(Espaco espaco) {
        pontos.excluirDoEspaco(espaco.getId());
        importarOriginais(espaco);
        return listar(espaco);
    }

    /** Cadastra os locais de espacos/&lt;slug&gt;/locais.json (lista original do espaço). */
    @Transactional
    public int importarOriginais(Espaco espaco) {
        Path arquivo = espacoServico.pastaDoPacote(espaco).resolve("locais.json");
        if (!Files.isRegularFile(arquivo)) {
            return 0; // espaço novo sem lista inicial: os locais são cadastrados pelo admin
        }
        List<PontoRequisicao> originais;
        try {
            originais = objectMapper.readValue(Files.readString(arquivo), new TypeReference<>() {});
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível ler a lista original de locais em " + arquivo, e);
        }
        for (PontoRequisicao req : originais) {
            PontoAcessibilidade ponto = new PontoAcessibilidade();
            ponto.setEspaco(espaco);
            try {
                preencher(espaco, ponto, req, null);
            } catch (RegraNegocioException e) {
                throw new IllegalStateException("Local \"" + req.nome() + "\" inválido em " + arquivo + ": " + e.getMessage(), e);
            }
            pontos.save(ponto);
        }
        return originais.size();
    }

    @Transactional(readOnly = true)
    public long contar(Espaco espaco) {
        return pontos.countByEspacoId(espaco.getId());
    }

    private PontoAcessibilidade buscar(Espaco espaco, Integer id, String mensagemSeNaoExistir) {
        return pontos.findById(id)
                .filter(p -> p.getEspaco().getId().equals(espaco.getId()))
                .orElseThrow(() -> RegraNegocioException.naoEncontrado(mensagemSeNaoExistir));
    }

    private void preencher(Espaco espaco, PontoAcessibilidade ponto, PontoRequisicao req, Integer adminId) {
        String tipo = req.tipo().trim();
        if (PontoAcessibilidade.TIPO_GERAL.equals(tipo) || PontoAcessibilidade.TIPO_ALERTA.equals(tipo)) {
            ponto.setTipo(tipo);
            ponto.setCategoria(null);
        } else {
            // Ponto de acessibilidade: o tipo é o código da categoria (fisica, auditiva...)
            CategoriaAcessibilidade categoria = categorias.findByCodigo(tipo)
                    .orElseThrow(() -> RegraNegocioException.invalido("Tipo de local inválido: " + tipo + "."));
            ponto.setTipo(PontoAcessibilidade.TIPO_ACESSIBILIDADE);
            ponto.setCategoria(categoria);
        }

        Planta planta;
        try {
            planta = espacoServico.planta(espaco, req.planta());
        } catch (RegraNegocioException e) {
            // Planta informada no corpo da requisição: é um dado inválido, não uma rota inexistente
            throw RegraNegocioException.invalido("Planta inválida: " + req.planta() + ".");
        }

        // Locais cadastrados numa planta com bloco fixo (ex.: subsolo de um prédio) ficam nesse bloco
        String bloco = vazioParaNulo(req.blocoPai());
        if (bloco == null && planta.getBloco() != null) {
            bloco = planta.getBloco();
        }
        if (bloco != null && !espacoServico.areaExiste(espaco, bloco)) {
            throw RegraNegocioException.invalido("Bloco inválido: " + bloco + ".");
        }
        String area = vazioParaNulo(req.categoria());

        ponto.setNome(req.nome().trim());
        ponto.setDescricao(vazioParaNulo(req.descricao()));
        ponto.setArea(area != null ? area : (bloco != null ? bloco : "geral"));
        ponto.setPlanta(planta);
        ponto.setBloco(bloco);
        ponto.setSubponto(req.subponto() != null ? req.subponto() : bloco != null);
        ponto.setPosX(req.x());
        ponto.setPosY(req.y());
        if (adminId != null) {
            ponto.setAdministrador(administradores.getReferenceById(adminId));
        }
    }

    private static String vazioParaNulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private static RegraNegocioException nomeDuplicado(String nome) {
        return RegraNegocioException.conflito("Já existe um local chamado \"" + nome + "\". Use um nome diferente.");
    }
}
