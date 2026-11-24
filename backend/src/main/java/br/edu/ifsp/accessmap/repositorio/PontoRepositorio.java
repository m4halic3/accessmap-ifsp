package br.edu.ifsp.accessmap.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.edu.ifsp.accessmap.dominio.PontoAcessibilidade;

public interface PontoRepositorio extends JpaRepository<PontoAcessibilidade, Integer> {

    /** Locais do espaço, na ordem de cadastro, já com categoria e planta (evita uma consulta por local). */
    @Query("select p from PontoAcessibilidade p left join fetch p.categoria join fetch p.planta "
            + "where p.espaco.id = :espacoId order by p.id")
    List<PontoAcessibilidade> listarDoEspaco(@Param("espacoId") Integer espacoId);

    long countByEspacoId(Integer espacoId);

    // A comparação de nomes segue a collation do banco (utf8mb4_unicode_ci):
    // ignora maiúsculas e acentos, como a busca do front-end.
    boolean existsByEspacoIdAndNome(Integer espacoId, String nome);

    boolean existsByEspacoIdAndNomeAndIdNot(Integer espacoId, String nome, Integer id);

    Optional<PontoAcessibilidade> findFirstByEspacoIdAndNome(Integer espacoId, String nome);

    // Exclusão direto no banco: as colaborações ligadas ficam com ponto_id nulo (ON DELETE SET NULL)
    @Modifying
    @Query("delete from PontoAcessibilidade p where p.espaco.id = :espacoId")
    void excluirDoEspaco(@Param("espacoId") Integer espacoId);
}
