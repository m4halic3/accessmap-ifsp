package br.edu.ifsp.accessmap.web;

import java.time.Duration;
import java.util.List;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.edu.ifsp.accessmap.dominio.PlantaVersao;
import br.edu.ifsp.accessmap.dto.PlantaDto;
import br.edu.ifsp.accessmap.servico.EspacoServico;
import br.edu.ifsp.accessmap.servico.PlantaServico;

/** Imagens de planta enviadas pelo administrador ("Atualizar imagem do mapa"). */
@RestController
@RequestMapping("/api/plantas")
public class PlantaController {

    private final PlantaServico plantaServico;
    private final EspacoServico espacoServico;

    public PlantaController(PlantaServico plantaServico, EspacoServico espacoServico) {
        this.plantaServico = plantaServico;
        this.espacoServico = espacoServico;
    }

    /** Plantas personalizadas em uso no espaço (plantas sem item usam a imagem original). */
    @GetMapping
    public List<PlantaDto> listar(@RequestParam(name = "espaco", required = false) String espaco) {
        return plantaServico.listar(espacoServico.resolver(espaco));
    }

    @GetMapping("/{ala}")
    public PlantaDto buscar(@PathVariable String ala, @RequestParam(name = "espaco", required = false) String espaco) {
        return plantaServico.buscar(espacoServico.resolver(espaco), ala);
    }

    /** O arquivo da imagem. Cada versão tem id próprio, então pode ficar em cache. */
    @GetMapping("/arquivos/{id}")
    public ResponseEntity<byte[]> arquivo(@PathVariable Integer id) {
        PlantaVersao planta = plantaServico.arquivo(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(planta.getTipoMime()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(planta.getConteudo());
    }

    @PostMapping("/{ala}")
    @ResponseStatus(HttpStatus.CREATED)
    public PlantaDto publicar(@PathVariable String ala,
                              @RequestParam("arquivo") MultipartFile arquivo,
                              @RequestParam int largura,
                              @RequestParam int altura,
                              @RequestParam(required = false) String alt,
                              @AuthenticationPrincipal Jwt jwt,
                              @RequestParam(name = "espaco", required = false) String espaco) {
        return plantaServico.publicar(espacoServico.resolver(espaco), ala, arquivo, largura, altura, alt,
                UsuarioLogado.id(jwt));
    }

    /** Volta ao mapa anterior. Sem corpo (204) quando volta a imagem original. */
    @PostMapping("/{ala}/voltar")
    public ResponseEntity<PlantaDto> voltar(@PathVariable String ala, @RequestParam(name = "espaco", required = false) String espaco) {
        return plantaServico.voltarAnterior(espacoServico.resolver(espaco), ala)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{ala}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void restaurarOriginal(@PathVariable String ala, @RequestParam(name = "espaco", required = false) String espaco) {
        plantaServico.restaurarOriginal(espacoServico.resolver(espaco), ala);
    }
}
