package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.accessmap.dominio.Area;

public interface AreaRepositorio extends JpaRepository<Area, Integer> {

    List<Area> findByEspacoIdOrderByOrdemAscIdAsc(Integer espacoId);

    Optional<Area> findByEspacoIdAndCodigo(Integer espacoId, String codigo);

    boolean existsByEspacoIdAndCodigo(Integer espacoId, String codigo);
}
