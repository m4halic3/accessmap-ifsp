package br.edu.ifsp.accessmap.dto;

import java.time.Instant;

public record LoginResposta(String token, Instant expiraEm, String usuario) {
}
