package br.edu.ifsp.accessmap.dto;

import java.time.OffsetDateTime;
import java.time.ZoneId;

import br.edu.ifsp.accessmap.dominio.Colaboracao;

/** Colaboração no formato lido pelo dashboard (mesmos campos da v1). */
public record ColaboracaoDto(Integer id, String local, String categoria, String relato,
                             OffsetDateTime data, String status) {

    public static ColaboracaoDto de(Colaboracao c) {
        return new ColaboracaoDto(c.getId(), c.getLocalTexto(), c.getCategoria().getCodigo(), c.getRelato(),
                c.getCriadoEm().atZone(ZoneId.systemDefault()).toOffsetDateTime(), c.getStatus());
    }
}
