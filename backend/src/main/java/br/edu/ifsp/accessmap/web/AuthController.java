package br.edu.ifsp.accessmap.web;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.accessmap.dto.LoginRequisicao;
import br.edu.ifsp.accessmap.dto.LoginResposta;
import br.edu.ifsp.accessmap.servico.AuthServico;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServico authServico;

    public AuthController(AuthServico authServico) {
        this.authServico = authServico;
    }

    @PostMapping("/login")
    public LoginResposta login(@Valid @RequestBody LoginRequisicao req) {
        return authServico.login(req.usuario(), req.senha());
    }

    /** Confere se o token ainda vale (usado pelas páginas do admin ao abrir). */
    @GetMapping("/sessao")
    public Map<String, Object> sessao(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("usuario", jwt.getSubject(), "expiraEm", jwt.getExpiresAt());
    }
}
