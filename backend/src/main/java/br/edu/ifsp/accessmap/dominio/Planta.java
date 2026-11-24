package br.edu.ifsp.accessmap.dominio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Planta (imagem de fundo) de um espaço: o mapa geral, um andar, um subsolo...
 * Os locais são posicionados em coordenadas de 0..largura x 0..altura.
 */
@Entity
@Table(name = "planta")
public class Planta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "espaco_id", nullable = false)
    private Espaco espaco;

    @Column(nullable = false, length = 40)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "rotulo_curto", nullable = false, length = 40)
    private String rotuloCurto;

    @Column(length = 150)
    private String descricao;

    @Column(nullable = false)
    private boolean principal;

    @Column(name = "andar_rotulo", length = 40)
    private String andarRotulo;

    @Column(name = "prefixo_nome", length = 100)
    private String prefixoNome;

    @Column(length = 40)
    private String bloco;

    @Column(nullable = false)
    private int largura;

    @Column(nullable = false)
    private int altura;

    @Column(name = "imagem_url", nullable = false, length = 300)
    private String imagemUrl;

    @Column(name = "hd_url", length = 300)
    private String hdUrl;

    @Column(name = "proporcao_arte")
    private Double proporcaoArte;

    @Column(name = "texto_alternativo", length = 300)
    private String textoAlternativo;

    @Column(nullable = false)
    private int ordem;

    protected Planta() {}

    public Planta(Espaco espaco, String codigo) {
        this.espaco = espaco;
        this.codigo = codigo;
    }

    public Integer getId() { return id; }
    public Espaco getEspaco() { return espaco; }
    public String getCodigo() { return codigo; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getRotuloCurto() { return rotuloCurto; }
    public void setRotuloCurto(String rotuloCurto) { this.rotuloCurto = rotuloCurto; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public boolean isPrincipal() { return principal; }
    public void setPrincipal(boolean principal) { this.principal = principal; }
    public String getAndarRotulo() { return andarRotulo; }
    public void setAndarRotulo(String andarRotulo) { this.andarRotulo = andarRotulo; }
    public String getPrefixoNome() { return prefixoNome; }
    public void setPrefixoNome(String prefixoNome) { this.prefixoNome = prefixoNome; }
    public String getBloco() { return bloco; }
    public void setBloco(String bloco) { this.bloco = bloco; }
    public int getLargura() { return largura; }
    public void setLargura(int largura) { this.largura = largura; }
    public int getAltura() { return altura; }
    public void setAltura(int altura) { this.altura = altura; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public String getHdUrl() { return hdUrl; }
    public void setHdUrl(String hdUrl) { this.hdUrl = hdUrl; }
    public Double getProporcaoArte() { return proporcaoArte; }
    public void setProporcaoArte(Double proporcaoArte) { this.proporcaoArte = proporcaoArte; }
    public String getTextoAlternativo() { return textoAlternativo; }
    public void setTextoAlternativo(String textoAlternativo) { this.textoAlternativo = textoAlternativo; }
    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }
}
