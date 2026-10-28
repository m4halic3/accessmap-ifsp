package br.edu.ifsp.accessmap.dto;

import br.edu.ifsp.accessmap.dominio.CategoriaAcessibilidade;

public record CategoriaDto(String codigo, String nome, String icone, String cor) {

    public static CategoriaDto de(CategoriaAcessibilidade c) {
        return new CategoriaDto(c.getCodigo(), c.getNome(), c.getIcone(), c.getCorIdentificacao());
    }
}
