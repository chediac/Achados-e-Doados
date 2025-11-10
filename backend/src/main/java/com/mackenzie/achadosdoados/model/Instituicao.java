package com.mackenzie.achadosdoados.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

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

    // Campos de localização para mapa
    @Column(length = 10)
    private String cep;

    @Column(length = 100)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(length = 10)
    private String numero;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

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

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public List<Demanda> getDemandas() {
        return demandas;
    }

    public void setDemandas(List<Demanda> demandas) {
        this.demandas = demandas;
    }
}