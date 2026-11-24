package br.edu.ifsp.accessmap.dto;

import br.edu.ifsp.accessmap.dominio.Espaco;

/** Item da lista de espaços disponíveis (GET /api/espacos). */
public record EspacoResumoDto(String slug, String nome, String tipo, String cidade, boolean padrao) {

    public static EspacoResumoDto de(Espaco e) {
        return new EspacoResumoDto(e.getSlug(), e.getNome(), e.getTipo(), e.getCidade(), e.isPadrao());
    }
}
