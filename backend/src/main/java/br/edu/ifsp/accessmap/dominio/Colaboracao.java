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

/** Relato ou sugestão enviado pelo formulário público. */
@Entity
@Table(name = "colaboracao")
public class Colaboracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaAcessibilidade categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ponto_id")
    private PontoAcessibilidade ponto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador_id")
    private Administrador administrador;

    @Column(name = "local_texto", nullable = false, length = 150)
    private String localTexto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String relato;

    @Column(nullable = false, length = 20)
    private String status = "pendente";

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "excluido_em")
    private LocalDateTime excluidoEm;

    @PrePersist
    void aoCriar() {
        criadoEm = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public CategoriaAcessibilidade getCategoria() { return categoria; }
    public void setCategoria(CategoriaAcessibilidade categoria) { this.categoria = categoria; }
    public PontoAcessibilidade getPonto() { return ponto; }
    public void setPonto(PontoAcessibilidade ponto) { this.ponto = ponto; }
    public Administrador getAdministrador() { return administrador; }
    public void setAdministrador(Administrador administrador) { this.administrador = administrador; }
    public String getLocalTexto() { return localTexto; }
    public void setLocalTexto(String localTexto) { this.localTexto = localTexto; }
    public String getRelato() { return relato; }
    public void setRelato(String relato) { this.relato = relato; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getIpOrigem() { return ipOrigem; }
    public void setIpOrigem(String ipOrigem) { this.ipOrigem = ipOrigem; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getExcluidoEm() { return excluidoEm; }
    public void setExcluidoEm(LocalDateTime excluidoEm) { this.excluidoEm = excluidoEm; }
}
