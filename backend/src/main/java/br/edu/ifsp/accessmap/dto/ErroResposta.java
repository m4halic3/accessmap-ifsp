package br.edu.ifsp.accessmap.dto;

import java.util.Map;

/** Corpo das respostas de erro: `mensagem` pode ser exibida direto ao usuário. */
public record ErroResposta(String mensagem, Map<String, String> campos) {

    public ErroResposta(String mensagem) {
        this(mensagem, null);
    }
}
