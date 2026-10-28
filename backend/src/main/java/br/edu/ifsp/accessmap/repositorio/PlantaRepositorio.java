package br.edu.ifsp.accessmap.repositorio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.edu.ifsp.accessmap.dominio.PlantaVersao;

public interface PlantaRepositorio extends JpaRepository<PlantaVersao, Integer> {

    /** Só os dados descritivos (sem carregar a imagem, que pode ter vários MB). */
    interface Resumo {
        Integer getId();
        String getAla();
        String getNomeArquivo();
        int getLargura();
        int getAltura();
        String getTextoAlternativo();
        LocalDateTime getCriadoEm();
    }

    /** Versões da ala, da mais nova (em uso) para a mais antiga. */
    List<Resumo> findByAlaOrderByIdDesc(String ala);

    // Exclusões direto no banco, sem carregar as imagens na memória
    @Modifying
    @Query("delete from PlantaVersao p where p.id = :id")
    void excluirPorId(@Param("id") Integer id);

    @Modifying
    @Query("delete from PlantaVersao p where p.ala = :ala")
    void excluirPorAla(@Param("ala") String ala);

    @Modifying
    @Query("delete from PlantaVersao p where p.ala = :ala and p.id < :id")
    void excluirAnterioresA(@Param("ala") String ala, @Param("id") Integer id);
}
