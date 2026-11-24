package br.edu.ifsp.accessmap.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.accessmap.dto.EspacoDto;
import br.edu.ifsp.accessmap.dto.EspacoResumoDto;
import br.edu.ifsp.accessmap.servico.EspacoServico;

/** Espaços públicos atendidos e a configuração de cada um (plantas, áreas, textos). Leitura pública. */
@RestController
@RequestMapping("/api/espacos")
public class EspacoController {

    private final EspacoServico espacoServico;

    public EspacoController(EspacoServico espacoServico) {
        this.espacoServico = espacoServico;
    }

    @GetMapping
    public List<EspacoResumoDto> listar() {
        return espacoServico.listar();
    }

    /** Configuração do espaço padrão (usada quando a página não informa ?espaco=). */
    @GetMapping("/padrao")
    public EspacoDto padrao() {
        return espacoServico.configuracao(espacoServico.resolver(null));
    }

    @GetMapping("/{slug}")
    public EspacoDto buscar(@PathVariable String slug) {
        return espacoServico.configuracao(espacoServico.resolver(slug));
    }
}
