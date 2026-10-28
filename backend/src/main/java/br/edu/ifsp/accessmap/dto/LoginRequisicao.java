package br.edu.ifsp.accessmap.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequisicao(
        @NotBlank(message = "Preencha o usuário.") String usuario,
        @NotBlank(message = "Preencha a senha.") String senha) {
}
