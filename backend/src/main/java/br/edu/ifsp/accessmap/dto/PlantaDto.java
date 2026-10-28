package br.edu.ifsp.accessmap.dto;

import java.time.OffsetDateTime;

/**
 * Planta enviada pelo admin que está em uso numa ala.
 * `anterior` é a versão que volta com "Voltar ao mapa anterior"
 * ({ original: true } quando é a imagem original do projeto).
 */
public record PlantaDto(String ala, Integer id, String nome, int largura, int altura, String alt,
                        OffsetDateTime atualizadoEm, String url, Anterior anterior) {

    public record Anterior(Boolean original, String nome, OffsetDateTime atualizadoEm, String url) {

        public static Anterior imagemOriginal() {
            return new Anterior(true, null, null, null);
        }
    }
}
