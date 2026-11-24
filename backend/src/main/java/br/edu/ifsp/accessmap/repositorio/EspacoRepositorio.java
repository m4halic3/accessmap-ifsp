package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.accessmap.dominio.Espaco;

public interface EspacoRepositorio extends JpaRepository<Espaco, Integer> {

    Optional<Espaco> findBySlug(String slug);

    Optional<Espaco> findFirstByPadraoTrueAndAtivoTrueOrderByIdAsc();

    List<Espaco> findByAtivoTrueOrderByNomeAsc();
}
