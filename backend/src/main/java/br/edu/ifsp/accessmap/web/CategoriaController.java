package br.edu.ifsp.accessmap.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.accessmap.dto.CategoriaDto;
import br.edu.ifsp.accessmap.repositorio.CategoriaRepositorio;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepositorio categorias;

    public CategoriaController(CategoriaRepositorio categorias) {
        this.categorias = categorias;
    }

    @GetMapping
    public List<CategoriaDto> listar() {
        return categorias.findAllByOrderByIdAsc().stream().map(CategoriaDto::de).toList();
    }
}
