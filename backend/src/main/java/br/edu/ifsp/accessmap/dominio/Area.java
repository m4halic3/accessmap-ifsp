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
 * Área de um espaço (bloco, setor, ala...). No mapa, a COR diz onde o local
 * fica; `predio` é o nome do local que representa o próprio prédio.
 */
@Entity
@Table(name = "area")
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "espaco_id", nullable = false)
    private Espaco espaco;

    @Column(nullable = false, length = 40)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String rotulo;

    @Column(nullable = false, length = 7)
    private String cor;

    @Column(nullable = false, length = 50)
    private String icone;

    @Column(length = 150)
    private String predio;

    @Column(name = "o_que", length = 100)
    private String oQue;

    @Column(name = "na_legenda", nullable = false)
    private boolean naLegenda = true;

    @Column(nullable = false)
    private int ordem;

    protected Area() {}

    public Area(Espaco espaco, String codigo) {
        this.espaco = espaco;
        this.codigo = codigo;
    }

    public Integer getId() { return id; }
    public Espaco getEspaco() { return espaco; }
    public String getCodigo() { return codigo; }
    public String getRotulo() { return rotulo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }
    public String getPredio() { return predio; }
    public void setPredio(String predio) { this.predio = predio; }
    public String getOQue() { return oQue; }
    public void setOQue(String oQue) { this.oQue = oQue; }
    public boolean isNaLegenda() { return naLegenda; }
    public void setNaLegenda(boolean naLegenda) { this.naLegenda = naLegenda; }
    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }
}
