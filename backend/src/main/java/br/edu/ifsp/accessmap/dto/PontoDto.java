package br.edu.ifsp.accessmap.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.edu.ifsp.accessmap.dominio.PontoAcessibilidade;

/** Local no formato que o front-end usa no array `lugares` (mapa.js). */
public record PontoDto(
        Integer id,
        String nome,
        String tipo,
        String categoria,
        String andar,
        @JsonProperty("bloco_pai") String blocoPai,
        int x,
        int y,
        boolean subponto,
        String descricao,
        String status) {

    public static PontoDto de(PontoAcessibilidade p) {
        return new PontoDto(p.getId(), p.getNome(), p.getTipoFrontend(), p.getArea(), p.getAndar(),
                p.getBloco(), p.getPosX(), p.getPosY(), p.isSubponto(), p.getDescricao(), p.getStatus());
    }
}
