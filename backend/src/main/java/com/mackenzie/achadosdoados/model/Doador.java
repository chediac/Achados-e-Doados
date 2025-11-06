package com.mackenzie.achadosdoados.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

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

    public List<Doacao> getDoacoes() {
        return doacoes;
    }

    public void setDoacoes(List<Doacao> doacoes) {
        this.doacoes = doacoes;
    }
}