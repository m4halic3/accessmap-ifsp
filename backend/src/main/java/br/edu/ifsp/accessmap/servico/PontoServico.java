package br.edu.ifsp.accessmap.servico;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.edu.ifsp.accessmap.config.AccessmapProperties;
import br.edu.ifsp.accessmap.dominio.CategoriaAcessibilidade;
import br.edu.ifsp.accessmap.dominio.PontoAcessibilidade;
import br.edu.ifsp.accessmap.dto.PontoDto;
import br.edu.ifsp.accessmap.dto.PontoRequisicao;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.CategoriaRepositorio;
import br.edu.ifsp.accessmap.repositorio.PontoRepositorio;

@Service
public class PontoServico {

    private final PontoRepositorio pontos;
    private final CategoriaRepositorio categorias;
    private final AdministradorRepositorio administradores;
    private final ObjectMapper objectMapper;
    private final AccessmapProperties props;

    public PontoServico(PontoRepositorio pontos, CategoriaRepositorio categorias,
                        AdministradorRepositorio administradores, ObjectMapper objectMapper,
                        AccessmapProperties props) {
        this.pontos = pontos;
        this.categorias = categorias;
        this.administradores = administradores;
        this.objectMapper = objectMapper;
        this.props = props;
    }

    @Transactional(readOnly = true)
    public List<PontoDto> listar() {
        return pontos.listarTodos().stream().map(PontoDto::de).toList();
    }

    @Transactional
    public PontoDto criar(PontoRequisicao req, Integer adminId) {
        String nome = req.nome().trim();
        if (pontos.existsByNome(nome)) {
            throw nomeDuplicado(nome);
        }
        PontoAcessibilidade ponto = new PontoAcessibilidade();
        preencher(ponto, req, adminId);
        return PontoDto.de(pontos.save(ponto));
    }

    @Transactional
    public PontoDto atualizar(Integer id, PontoRequisicao req, Integer adminId) {
        PontoAcessibilidade ponto = pontos.findById(id)
                .orElseThrow(() -> RegraNegocioException.naoEncontrado("Este local não existe mais. Recarregue a página."));
        String nome = req.nome().trim();
        if (pontos.existsByNomeAndIdNot(nome, id)) {
            throw nomeDuplicado(nome);
        }
        preencher(ponto, req, adminId);
        return PontoDto.de(pontos.saveAndFlush(ponto));
    }

    @Transactional
    public void excluir(Integer id) {
        if (!pontos.existsById(id)) {
            throw RegraNegocioException.naoEncontrado("Este local já foi excluído.");
        }
        pontos.deleteById(id);
    }

    /** Apaga todos os locais e cadastra de novo a lista original do projeto. */
    @Transactional
    public List<PontoDto> restaurarOriginais() {
        // Exclusão direto no banco: as colaborações ligadas a locais ficam com ponto_id nulo (ON DELETE SET NULL)
        pontos.deleteAllInBatch();
        importarOriginais();
        return listar();
    }

    /** Cadastra os locais de assets/data/locais-originais.json (lista original do projeto). */
    @Transactional
    public int importarOriginais() {
        Path arquivo = props.pastaFrontend().resolve("assets/data/locais-originais.json");
        List<PontoRequisicao> originais;
        try {
            originais = objectMapper.readValue(Files.readString(arquivo), new TypeReference<>() {});
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível ler a lista original de locais em " + arquivo, e);
        }
        for (PontoRequisicao req : originais) {
            PontoAcessibilidade ponto = new PontoAcessibilidade();
            preencher(ponto, req, null);
            pontos.save(ponto);
        }
        return originais.size();
    }

    private void preencher(PontoAcessibilidade ponto, PontoRequisicao req, Integer adminId) {
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

        String bloco = vazioParaNulo(req.blocoPai());
        String area = vazioParaNulo(req.categoria());

        ponto.setNome(req.nome().trim());
        ponto.setDescricao(vazioParaNulo(req.descricao()));
        ponto.setArea(area != null ? area : (bloco != null ? bloco : "geral"));
        ponto.setAndar(req.andar() != null ? req.andar() : "terreo");
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
