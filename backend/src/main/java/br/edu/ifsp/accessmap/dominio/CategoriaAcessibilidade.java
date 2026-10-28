package br.edu.ifsp.accessmap.dominio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categoria_acessibilidade")
public class CategoriaAcessibilidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 30)
    private String codigo;

    @Column(nullable = false, length = 50)
    private String nome;

    @Column(length = 50)
    private String icone;

    @Column(name = "cor_identificacao", length = 7)
    private String corIdentificacao;

    protected CategoriaAcessibilidade() {}

    public Integer getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNome() { return nome; }
    public String getIcone() { return icone; }
    public String getCorIdentificacao() { return corIdentificacao; }
}
