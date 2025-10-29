package com.mackenzie.achadosdoados.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Entidade que representa o registro de uma Doação (ou intenção de doação)
 * feita por um Doador para atender a uma Demanda.
 */
@Entity
@Table(name = "doacoes")
public class Doacao implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime data; // Data e hora que a intenção de doação foi registrada

    @Column(length = 50)
    private String status; // Ex: "Aguardando", "Entregue", "Cancelada"

    // --- Relacionamentos ---

    /**
     * Relação Muitos-para-Um com Doador (quem "realiza").
     * Esta é a ponta "dona" da relação.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doador_id", nullable = false)
    private Doador doador;

    /**
     * Relação Muitos-para-Um com Demanda (o que "gera").
     * Esta é a ponta "dona" da relação.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demanda_id", nullable = false)
    private Demanda demanda;

    // --- Construtores ---

    public Doacao() {
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Doador getDoador() {
        return doador;
    }

    public void setDoador(Doador doador) {
        this.doador = doador;
    }

    public Demanda getDemanda() {
        return demanda;
    }

    public void setDemanda(Demanda demanda) {
        this.demanda = demanda;
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
        Doacao other = (Doacao) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }
}