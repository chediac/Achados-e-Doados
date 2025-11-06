package com.mackenzie.achadosdoados.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa a Instituição Social.
 * Esta classe herda de Usuario e está mapeada para a tabela 'instituicoes'.
 */
@Entity
@Table(name = "instituicoes")
@PrimaryKeyJoinColumn(name = "usuario_id") // Chave estrangeira para a tabela 'usuarios'
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer","handler","demandas"})
public class Instituicao extends Usuario {

    private static final long serialVersionUID = 1L;

    @Column(length = 255)
    private String endereco;

    @Column(length = 20)
    private String telefone;

    @Column(length = 500)
    private String fotoUrl;

    /**
     * Mapeia a relação "publica" do diagrama.
     * Uma Instituição pode publicar várias Demandas.
     * 'mappedBy = "instituicao"' indica que a entidade Demanda é a dona do relacionamento.
     */
    @OneToMany(mappedBy = "instituicao", fetch = FetchType.LAZY)
    private List<Demanda> demandas = new ArrayList<>();

    // --- Construtores ---

    public Instituicao() {
        super();
    }

    public Instituicao(String nome, String email, String senha, String endereco, String telefone) {
        super(nome, email, senha);
        this.endereco = endereco;
        this.telefone = telefone;
    }

    // --- Getters e Setters ---

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public List<Demanda> getDemandas() {
        return demandas;
    }

    public void setDemandas(List<Demanda> demandas) {
        this.demandas = demandas;
    }
}