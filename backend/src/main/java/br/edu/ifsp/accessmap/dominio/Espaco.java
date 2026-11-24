package br.edu.ifsp.accessmap.dominio;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/**
 * Espaço público mapeado (ex.: um campus, uma prefeitura, um parque).
 * Os dados vêm do pacote espacos/&lt;slug&gt;/espaco.json (ver EspacoServico).
 */
@Entity
@Table(name = "espaco")
public class Espaco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 60)
    private String slug;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, length = 40)
    private String tipo = "local";

    @Column(length = 100)
    private String cidade;

    @Column(nullable = false)
    private boolean padrao;

    @Column(nullable = false)
    private boolean ativo = true;

    /** Textos da interface, mapa de localização e destaques, em JSON. */
    @Column(columnDefinition = "TEXT")
    private String configuracao;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected Espaco() {}

    public Espaco(String slug) {
        this.slug = slug;
    }

    @PrePersist
    void aoCriar() {
        criadoEm = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public String getSlug() { return slug; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public boolean isPadrao() { return padrao; }
    public void setPadrao(boolean padrao) { this.padrao = padrao; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public String getConfiguracao() { return configuracao; }
    public void setConfiguracao(String configuracao) { this.configuracao = configuracao; }
}
