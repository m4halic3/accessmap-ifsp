package br.edu.ifsp.accessmap.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.accessmap.dto.ColaboracaoDto;
import br.edu.ifsp.accessmap.dto.ColaboracaoRequisicao;
import br.edu.ifsp.accessmap.servico.ColaboracaoServico;
import br.edu.ifsp.accessmap.servico.EspacoServico;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/** Relatos do formulário público. Envio público; leitura e moderação só para o administrador. */
@RestController
@RequestMapping("/api/colaboracoes")
public class ColaboracaoController {

    private final ColaboracaoServico colaboracaoServico;
    private final EspacoServico espacoServico;

    public ColaboracaoController(ColaboracaoServico colaboracaoServico, EspacoServico espacoServico) {
        this.colaboracaoServico = colaboracaoServico;
        this.espacoServico = espacoServico;
    }

    @GetMapping
    public List<ColaboracaoDto> listar(@RequestParam(name = "espaco", required = false) String espaco) {
        return colaboracaoServico.listar(espacoServico.resolver(espaco));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ColaboracaoDto criar(@Valid @RequestBody ColaboracaoRequisicao req, HttpServletRequest request,
                                @RequestParam(name = "espaco", required = false) String espaco) {
        return colaboracaoServico.criar(espacoServico.resolver(espaco), req, request.getRemoteAddr());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt, @RequestParam(name = "espaco", required = false) String espaco) {
        colaboracaoServico.excluir(espacoServico.resolver(espaco), id, UsuarioLogado.id(jwt));
    }

    /** Desfaz a exclusão. */
    @PostMapping("/{id}/restaurar")
    public ColaboracaoDto restaurar(@PathVariable Integer id, @RequestParam(name = "espaco", required = false) String espaco) {
        return colaboracaoServico.restaurar(espacoServico.resolver(espaco), id);
    }
}
