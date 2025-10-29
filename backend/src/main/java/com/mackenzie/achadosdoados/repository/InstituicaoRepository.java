package com.mackenzie.achadosdoados.repository;

import com.mackenzie.achadosdoados.model.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para a entidade Instituicao.
 * Herda os métodos CRUD básicos do JpaRepository.
 */
@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {

    // Métodos CRUD básicos como save(), findById(), findAll() e delete()
    // são herdados automaticamente do JpaRepository.

}