package com.mackenzie.achadosdoados.repository;

import com.mackenzie.achadosdoados.model.Demanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para a entidade Demanda.
 * Herda os métodos CRUD básicos e define métodos de busca
 * customizados para os filtros da aplicação.
 */
@Repository
public interface DemandaRepository extends JpaRepository<Demanda, Long> {

    /**
     * Busca todas as demandas associadas a um ID de instituição.
     * Útil para o painel "Meus Pedidos" da instituição.
     *
     * @param instituicaoId O ID da Instituição.
     * @return Uma lista de Demandas daquela instituição.
     */
    List<Demanda> findAllByInstituicaoId(Long instituicaoId);

    /**
     * Busca todas as demandas pela sua categoria (Tipo de doação).
     *
     * @param categoria A categoria a ser buscada (ex: "Roupas", "Alimentos").
     * @return Uma lista de Demandas que correspondem à categoria.
     */
    List<Demanda> findAllByCategoria(String categoria);

    /**
     * Busca todas as demandas por nível de urgência.
     *
     * @param nivelUrgencia O nível de urgência (ex: "Alta").
     * @return Uma lista de Demandas com aquele nível de urgência.
     */
    List<Demanda> findAllByNivelUrgencia(String nivelUrgencia);

    /**
     * Busca demandas onde o título contenha o termo de busca,
     * ignorando maiúsculas/minúsculas.
     * Útil para a barra de busca "O que você gostaria de doar?".
     *
     * @param termoBusca O texto a ser procurado no título.
     * @return Uma lista de Demandas correspondentes.
     */
    List<Demanda> findAllByTituloContainingIgnoreCase(String termoBusca);

    // Poderíamos adicionar buscas mais complexas combinando filtros,
    // mas por enquanto, isso pode ser feito na camada de Serviço (Service).
}