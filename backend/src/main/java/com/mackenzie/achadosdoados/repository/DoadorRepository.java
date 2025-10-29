package com.mackenzie.achadosdoados.repository;

import com.mackenzie.achadosdoados.model.Doador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade Doador.
 * Herda os métodos CRUD básicos do JpaRepository.
 */
@Repository
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // Por enquanto, não precisamos de métodos customizados aqui,
    // pois a busca por email já está definida em UsuarioRepository.
    // O JpaRepository já nos fornece save(), findById(), findAll(), delete(), etc.

}