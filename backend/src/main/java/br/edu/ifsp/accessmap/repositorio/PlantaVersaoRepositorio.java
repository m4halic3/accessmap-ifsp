package br.edu.ifsp.accessmap.repositorio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.edu.ifsp.accessmap.dominio.PlantaVersao;

/** Imagens enviadas pelo administrador para substituir a imagem original de uma planta. */
public interface PlantaVersaoRepositorio extends JpaRepository<PlantaVersao, Integer> {

    /** Só os dados descritivos (sem carregar a imagem, que pode ter vários MB). */
    interface Resumo {
        Integer getId();
        String getNomeArquivo();
        int getLargura();
        int getAltura();
        String getTextoAlternativo();
        LocalDateTime getCriadoEm();
    }

    /** Versões da planta, da mais nova (em uso) para a mais antiga. */
    List<Resumo> findByPlantaIdOrderByIdDesc(Integer plantaId);

    // Exclusões direto no banco, sem carregar as imagens na memória
    @Modifying
    @Query("delete from PlantaVersao p where p.id = :id")
    void excluirPorId(@Param("id") Integer id);

    @Modifying
    @Query("delete from PlantaVersao p where p.planta.id = :plantaId")
    void excluirPorPlanta(@Param("plantaId") Integer plantaId);

    @Modifying
    @Query("delete from PlantaVersao p where p.planta.id = :plantaId and p.id < :id")
    void excluirAnterioresA(@Param("plantaId") Integer plantaId, @Param("id") Integer id);
}
