package br.edu.ifsp.accessmap.dominio;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/** Imagem de planta enviada pelo administrador para uma ala do mapa. */
@Entity
@Table(name = "planta_versao")
public class PlantaVersao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 20)
    private String ala;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador_id")
    private Administrador administrador;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Column(name = "tipo_mime", nullable = false, length = 30)
    private String tipoMime;

    @Column(nullable = false)
    private int tamanho;

    @Column(nullable = false)
    private int largura;

    @Column(nullable = false)
    private int altura;

    @Column(name = "texto_alternativo", length = 300)
    private String textoAlternativo;

    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] conteudo;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected PlantaVersao() {}

    public PlantaVersao(String ala, Administrador administrador, String nomeArquivo, String tipoMime,
                        byte[] conteudo, int largura, int altura, String textoAlternativo) {
        this.ala = ala;
        this.administrador = administrador;
        this.nomeArquivo = nomeArquivo;
        this.tipoMime = tipoMime;
        this.conteudo = conteudo;
        this.tamanho = conteudo.length;
        this.largura = largura;
        this.altura = altura;
        this.textoAlternativo = textoAlternativo;
    }

    @PrePersist
    void aoCriar() {
        criadoEm = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public String getAla() { return ala; }
    public String getNomeArquivo() { return nomeArquivo; }
    public String getTipoMime() { return tipoMime; }
    public int getTamanho() { return tamanho; }
    public int getLargura() { return largura; }
    public int getAltura() { return altura; }
    public String getTextoAlternativo() { return textoAlternativo; }
    public byte[] getConteudo() { return conteudo; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
