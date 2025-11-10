package com.mackenzie.achadosdoados.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa o Usuário Doador.
 * Esta classe herda de Usuario e está mapeada para a tabela 'doadores'.
 */
@Entity
@Table(name = "doadores")
@PrimaryKeyJoinColumn(name = "usuario_id") // Chave estrangeira para a tabela 'usuarios'
public class Doador extends Usuario {

    private static final long serialVersionUID = 1L;

    // Campos de localização para mapa
    @javax.persistence.Column(length = 10)
    private String cep;

    @javax.persistence.Column(length = 100)
    private String cidade;

    @javax.persistence.Column(length = 2)
    private String estado;

    @javax.persistence.Column
    private Double latitude;

    @javax.persistence.Column
    private Double longitude;

    /**
     * Mapeia a relação "realiza" do diagrama[cite: 349].
     * Um Doador pode realizar várias Doações.
     * 'mappedBy = "doador"' indica que a entidade Doacao é a dona do relacionamento.
     * FetchType.LAZY = As doações não são carregadas do banco até que
     * a lista 'doacoes' seja explicitamente acessada.
     */
    @OneToMany(mappedBy = "doador", fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Doacao> doacoes = new ArrayList<>();

    // --- Construtores ---

    public Doador() {
        super();
    }

    public Doador(String nome, String email, String senha) {
        super(nome, email, senha);
    }

    // --- Getters e Setters ---

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

    public List<Doacao> getDoacoes() {
        return doacoes;
    }

    public void setDoacoes(List<Doacao> doacoes) {
        this.doacoes = doacoes;
    }
}