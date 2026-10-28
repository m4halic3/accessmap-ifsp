package br.edu.ifsp.accessmap.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Dados enviados pelo admin ao inserir ou editar um local. */
public record PontoRequisicao(
        @NotBlank(message = "Digite um nome para o local.")
        @Size(max = 150, message = "O nome pode ter no máximo 150 caracteres.")
        String nome,

        @NotBlank(message = "Escolha o tipo do local.")
        String tipo,

        @Pattern(regexp = "[a-z_]{1,40}", message = "Categoria inválida.")
        String categoria,

        @Pattern(regexp = "terreo|subsolo", message = "Andar inválido.")
        String andar,

        @JsonProperty("bloco_pai")
        @Pattern(regexp = "informatica|mecanica|edificacoes|administrativo", message = "Bloco inválido.")
        String blocoPai,

        @NotNull(message = "Clique no mapa para marcar a posição do local.")
        @Min(value = 0, message = "Posição fora do mapa.") @Max(value = 5000, message = "Posição fora do mapa.")
        Integer x,

        @NotNull(message = "Clique no mapa para marcar a posição do local.")
        @Min(value = 0, message = "Posição fora do mapa.") @Max(value = 5000, message = "Posição fora do mapa.")
        Integer y,

        Boolean subponto,

        @Size(max = 2000, message = "A descrição pode ter no máximo 2000 caracteres.")
        String descricao) {
}
