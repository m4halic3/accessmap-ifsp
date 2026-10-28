package br.edu.ifsp.accessmap.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.edu.ifsp.accessmap.dominio.Colaboracao;

public interface ColaboracaoRepositorio extends JpaRepository<Colaboracao, Integer> {

    /** Colaborações não excluídas, das mais recentes para as mais antigas. */
    @Query("select c from Colaboracao c join fetch c.categoria where c.excluidoEm is null order by c.criadoEm desc")
    List<Colaboracao> listarAtivas();
}
