package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.edu.ifsp.accessmap.dominio.PontoAcessibilidade;

public interface PontoRepositorio extends JpaRepository<PontoAcessibilidade, Integer> {

    /** Todos os locais, na ordem de cadastro, já com a categoria (evita uma consulta por local). */
    @Query("select p from PontoAcessibilidade p left join fetch p.categoria order by p.id")
    List<PontoAcessibilidade> listarTodos();

    // A comparação de nomes segue a collation do banco (utf8mb4_unicode_ci):
    // ignora maiúsculas e acentos, como a busca do front-end.
    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, Integer id);

    Optional<PontoAcessibilidade> findFirstByNome(String nome);
}
