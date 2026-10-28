package br.edu.ifsp.accessmap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ColaboracaoRequisicao(
        @NotBlank(message = "Informe o local da ocorrência.")
        @Size(max = 150, message = "O local pode ter no máximo 150 caracteres.")
        String local,

        @NotBlank(message = "Selecione uma categoria de acessibilidade.")
        String categoria,

        @NotBlank(message = "Descreva o problema.")
        @Size(min = 10, max = 2000, message = "O relato deve ter entre 10 e 2000 caracteres.")
        String relato) {
}
