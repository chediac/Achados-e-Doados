package com.mackenzie.achadosdoados.repository;

import com.mackenzie.achadosdoados.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para a entidade Usuario.
 * Estende JpaRepository para obter métodos CRUD básicos (save, findById, etc.)
 * e métodos de busca derivados.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo seu endereço de e-mail.
     * O Spring Data JPA implementará este método automaticamente.
     *
     * @param email O e-mail a ser buscado.
     * @return um Optional contendo o Usuário, se encontrado.
     */
    Optional<Usuario> findByEmail(String email);

}