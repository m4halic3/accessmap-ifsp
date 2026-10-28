package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.accessmap.dominio.CategoriaAcessibilidade;

public interface CategoriaRepositorio extends JpaRepository<CategoriaAcessibilidade, Integer> {

    Optional<CategoriaAcessibilidade> findByCodigo(String codigo);

    List<CategoriaAcessibilidade> findAllByOrderByIdAsc();
}
