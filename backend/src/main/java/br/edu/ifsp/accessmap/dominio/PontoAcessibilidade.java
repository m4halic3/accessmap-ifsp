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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Local do mapa. Os campos seguem o que o front-end usa em `lugares`
 * (mapa.js): area = "categoria", bloco = "bloco_pai", posX/posY = x/y.
 */
@Entity
@Table(name = "ponto_acessibilidade")
public class PontoAcessibilidade {

    public static final String TIPO_GERAL = "geral";
    public static final String TIPO_ACESSIBILIDADE = "acessibilidade";
    public static final String TIPO_ALERTA = "alerta";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private CategoriaAcessibilidade categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador_id")
    private Administrador administrador;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(nullable = false, length = 40)
    private String area;

    @Column(nullable = false, length = 10)
    private String andar;

    @Column(length = 40)
    private String bloco;

    @Column(nullable = false)
    private boolean subponto;

    @Column(name = "pos_x", nullable = false)
    private int posX;

    @Column(name = "pos_y", nullable = false)
    private int posY;

    @Column(nullable = false, length = 20)
    private String status = "ativo";

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    void aoCriar() {
        criadoEm = LocalDateTime.now();
    }

    @PreUpdate
    void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }

    /** Tipo como o front-end conhece: geral, alerta ou o código da categoria (fisica, auditiva...). */
    public String getTipoFrontend() {
        return TIPO_ACESSIBILIDADE.equals(tipo) && categoria != null ? categoria.getCodigo() : tipo;
    }

    public Integer getId() { return id; }
    public CategoriaAcessibilidade getCategoria() { return categoria; }
    public void setCategoria(CategoriaAcessibilidade categoria) { this.categoria = categoria; }
    public Administrador getAdministrador() { return administrador; }
    public void setAdministrador(Administrador administrador) { this.administrador = administrador; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getAndar() { return andar; }
    public void setAndar(String andar) { this.andar = andar; }
    public String getBloco() { return bloco; }
    public void setBloco(String bloco) { this.bloco = bloco; }
    public boolean isSubponto() { return subponto; }
    public void setSubponto(boolean subponto) { this.subponto = subponto; }
    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }
    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
