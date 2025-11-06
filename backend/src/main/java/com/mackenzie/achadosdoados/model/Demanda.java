package com.mackenzie.achadosdoados.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa uma Demanda (ou Pedido de Doação)
 * registrada por uma Instituição.
 */
@Entity
@Table(name = "demandas")
public class Demanda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo; // 

    @Column(nullable = false, length = 100)
    private String categoria; // 

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao; // 

    @Column(length = 100)
    private String quantidadeDescricao; // Ex: "50 peças", "10 kits" [cite: 161]

    @Column(length = 50)
    private String status; // Ex: "Ativo", "Aguardando", "Concluído" 

    @Column(length = 50)
    private String nivelUrgencia; // Ex: "Baixa", "Média", "Alta" [cite: 164, 165, 167, 168]

    private LocalDate prazoDesejado; // 

    private Integer metaNumerica; // Opcional [cite: 169, 171]

    // --- Relacionamentos ---

    /**
     * Relação Muitos-para-Um com Instituicao.
     * Muitas demandas pertencem a UMA instituição.
     * Esta é a ponta "dona" da relação.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id", nullable = false)
    @JsonIgnoreProperties({"demandas", "senha"})
    private Instituicao instituicao;

    /**
     * Relação Uma-para-Muitas com Doacao.
     * UMA demanda pode gerar VÁRIAS doações.
     */
    @OneToMany(mappedBy = "demanda", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Doacao> doacoes = new ArrayList<>();

    // --- Construtores ---

    public Demanda() {
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getQuantidadeDescricao() {
        return quantidadeDescricao;
    }

    public void setQuantidadeDescricao(String quantidadeDescricao) {
        this.quantidadeDescricao = quantidadeDescricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNivelUrgencia() {
        return nivelUrgencia;
    }

    public void setNivelUrgencia(String nivelUrgencia) {
        this.nivelUrgencia = nivelUrgencia;
    }

    public LocalDate getPrazoDesejado() {
        return prazoDesejado;
    }

    public void setPrazoDesejado(LocalDate prazoDesejado) {
        this.prazoDesejado = prazoDesejado;
    }

    public Integer getMetaNumerica() {
        return metaNumerica;
    }

    public void setMetaNumerica(Integer metaNumerica) {
        this.metaNumerica = metaNumerica;
    }

    public Instituicao getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(Instituicao instituicao) {
        this.instituicao = instituicao;
    }

    public List<Doacao> getDoacoes() {
        return doacoes;
    }

    public void setDoacoes(List<Doacao> doacoes) {
        this.doacoes = doacoes;
    }

    // --- hashCode e equals (baseados no ID) ---

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Demanda other = (Demanda) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }
}