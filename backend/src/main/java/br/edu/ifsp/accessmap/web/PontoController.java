package br.edu.ifsp.accessmap.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.accessmap.dto.PontoDto;
import br.edu.ifsp.accessmap.dto.PontoRequisicao;
import br.edu.ifsp.accessmap.servico.PontoServico;
import jakarta.validation.Valid;

/** Locais do mapa. Leitura pública; o resto só para o administrador. */
@RestController
@RequestMapping("/api/pontos")
public class PontoController {

    private final PontoServico pontoServico;

    public PontoController(PontoServico pontoServico) {
        this.pontoServico = pontoServico;
    }

    @GetMapping
    public List<PontoDto> listar() {
        return pontoServico.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PontoDto criar(@Valid @RequestBody PontoRequisicao req, @AuthenticationPrincipal Jwt jwt) {
        return pontoServico.criar(req, UsuarioLogado.id(jwt));
    }

    @PutMapping("/{id}")
    public PontoDto atualizar(@PathVariable Integer id, @Valid @RequestBody PontoRequisicao req,
                              @AuthenticationPrincipal Jwt jwt) {
        return pontoServico.atualizar(id, req, UsuarioLogado.id(jwt));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Integer id) {
        pontoServico.excluir(id);
    }

    @PostMapping("/restaurar-originais")
    public List<PontoDto> restaurarOriginais() {
        return pontoServico.restaurarOriginais();
    }
}
