package com.mackenzie.achadosdoados.repository;

import com.mackenzie.achadosdoados.model.Doacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para a entidade Doacao.
 * Herda os métodos CRUD básicos do JpaRepository.
 */
@Repository
public interface DoacaoRepository extends JpaRepository<Doacao, Long> {

    /**
     * Busca todas as doações feitas por um Doador específico.
     * Útil para o "Meu Perfil" do doador.
     *
     * @param doadorId O ID do Doador.
     * @return Uma lista de Doações daquele doador.
     */
    List<Doacao> findAllByDoadorId(Long doadorId);

    /**
     * Busca todas as doações recebidas para uma Demanda específica.
     *
     * @param demandaId O ID da Demanda.
     * @return Uma lista de Doações para aquela demanda.
     */
    @Query("SELECT d FROM Doacao d JOIN FETCH d.doador WHERE d.demanda.id = :demandaId")
    List<Doacao> findAllByDemandaId(@Param("demandaId") Long demandaId);

    /**
     * Busca todas as doações recebidas por uma Instituição.
     * O Spring Data JPA "atravessa" as entidades: Doacao -> Demanda -> Instituicao -> Id.
     * Essencial para o painel "Doações Recebidas" da instituição.
     *
     * @param instituicaoId O ID da Instituição.
     * @return Uma lista de todas as Doações para as demandas daquela instituição.
     */
    List<Doacao> findAllByDemandaInstituicaoId(Long instituicaoId);
}