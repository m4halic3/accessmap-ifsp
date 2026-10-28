package br.edu.ifsp.accessmap.servico;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.accessmap.dominio.Colaboracao;
import br.edu.ifsp.accessmap.dto.ColaboracaoDto;
import br.edu.ifsp.accessmap.dto.ColaboracaoRequisicao;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.CategoriaRepositorio;
import br.edu.ifsp.accessmap.repositorio.ColaboracaoRepositorio;
import br.edu.ifsp.accessmap.repositorio.PontoRepositorio;

@Service
public class ColaboracaoServico {

    private final ColaboracaoRepositorio colaboracoes;
    private final CategoriaRepositorio categorias;
    private final PontoRepositorio pontos;
    private final AdministradorRepositorio administradores;

    public ColaboracaoServico(ColaboracaoRepositorio colaboracoes, CategoriaRepositorio categorias,
                              PontoRepositorio pontos, AdministradorRepositorio administradores) {
        this.colaboracoes = colaboracoes;
        this.categorias = categorias;
        this.pontos = pontos;
        this.administradores = administradores;
    }

    @Transactional(readOnly = true)
    public List<ColaboracaoDto> listar() {
        return colaboracoes.listarAtivas().stream().map(ColaboracaoDto::de).toList();
    }

    @Transactional
    public ColaboracaoDto criar(ColaboracaoRequisicao req, String ipOrigem) {
        Colaboracao c = new Colaboracao();
        c.setCategoria(categorias.findByCodigo(req.categoria().trim())
                .orElseThrow(() -> RegraNegocioException.invalido("Selecione uma categoria de acessibilidade válida.")));
        c.setLocalTexto(req.local().trim());
        c.setRelato(req.relato().trim());
        c.setIpOrigem(ipOrigem);
        // Se o local digitado é o nome de um local do mapa, já liga a colaboração a ele
        pontos.findFirstByNome(c.getLocalTexto()).ifPresent(c::setPonto);
        return ColaboracaoDto.de(colaboracoes.save(c));
    }

    /** Exclusão lógica: some do dashboard, mas pode ser desfeita. */
    @Transactional
    public void excluir(Integer id, Integer adminId) {
        Colaboracao c = buscar(id);
        c.setExcluidoEm(LocalDateTime.now());
        c.setAdministrador(administradores.getReferenceById(adminId));
    }

    @Transactional
    public ColaboracaoDto restaurar(Integer id) {
        Colaboracao c = buscar(id);
        c.setExcluidoEm(null);
        return ColaboracaoDto.de(c);
    }

    private Colaboracao buscar(Integer id) {
        return colaboracoes.findById(id)
                .orElseThrow(() -> RegraNegocioException.naoEncontrado("Esta resposta não existe mais."));
    }
}
