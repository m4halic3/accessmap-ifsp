package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.accessmap.dominio.Planta;

public interface PlantaRepositorio extends JpaRepository<Planta, Integer> {

    /** Plantas do espaço, na ordem dos botões do mapa. */
    List<Planta> findByEspacoIdOrderByOrdemAscIdAsc(Integer espacoId);

    Optional<Planta> findByEspacoIdAndCodigo(Integer espacoId, String codigo);
}
