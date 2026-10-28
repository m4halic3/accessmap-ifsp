package br.edu.ifsp.accessmap.web;

import org.springframework.security.oauth2.jwt.Jwt;

/** Lê do token JWT o id do administrador logado. */
final class UsuarioLogado {

    private UsuarioLogado() {}

    static Integer id(Jwt jwt) {
        Object id = jwt.getClaim("adm");
        return id instanceof Number n ? n.intValue() : null;
    }
}
