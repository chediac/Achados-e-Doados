package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.DemandaRepository;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Classe de serviço para gerenciar a lógica de negócio das Demandas (Pedidos de Doação).
 * Implementa os Casos de Uso UC1 (Buscar) e UC4 (CRUD).
 */
@Service
public class DemandaService {

    private final DemandaRepository demandaRepository;
    private final InstituicaoRepository instituicaoRepository;

    public DemandaService(DemandaRepository demandaRepository, InstituicaoRepository instituicaoRepository) {
        this.demandaRepository = demandaRepository;
        this.instituicaoRepository = instituicaoRepository;
    }

    /**
     * UC4 - Criar Doação (Demanda)
     * Cria uma nova demanda (pedido de doação) associada a uma instituição.
     *
     * @param demanda       O objeto Demanda com os dados do formulário.
     * @param instituicaoId O ID da instituição que está criando a demanda.
     * @return A Demanda salva.
     */
    @Transactional
    public Demanda criarDemanda(Demanda demanda, Long instituicaoId) {
        // Regra de Negócio: Campos obrigatórios
        if (demanda.getTitulo() == null || demanda.getTitulo().isEmpty() ||
            demanda.getCategoria() == null || demanda.getCategoria().isEmpty() ||
            demanda.getQuantidadeDescricao() == null || demanda.getQuantidadeDescricao().isEmpty()) {
            // Fluxo Alternativo A1 - Dados inválidos
            throw new RuntimeException("Dados inválidos. Título, Categoria e Quantidade são obrigatórios.");
        }

        // 1. Busca a instituição que está criando a demanda
        Instituicao instituicao = instituicaoRepository.findById(instituicaoId)
                .orElseThrow(() -> new RuntimeException("Instituição não encontrada."));

        // 2. Associa a demanda à instituição
        demanda.setInstituicao(instituicao);

        // 3. Define um status inicial
        if (demanda.getStatus() == null) {
            demanda.setStatus("Ativo");
        }

        // 4. Salva no banco
        return demandaRepository.save(demanda);
    }

    /**
     * UC1 - Buscar demanda
     * Retorna todas as demandas ativas.
     *
     * @return Lista de todas as demandas.
     */
    @Transactional(readOnly = true) // readOnly = true otimiza a transação para leitura
    public List<Demanda> buscarTodasDemandas() {
        List<Demanda> todasDemandas = demandaRepository.findAllWithInstituicao();
        // Filtrar demandas inativas (deletadas logicamente)
        return todasDemandas.stream()
                .filter(d -> !"Inativo".equals(d.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * UC1 - Buscar demanda (Filtro)
     * Retorna demandas com base em um termo de busca no título.
     *
     * @param titulo Termo de busca para o título.
     * @return Lista de demandas filtradas.
     */
    @Transactional(readOnly = true)
    public List<Demanda> buscarDemandasPorTitulo(String titulo) {
        return demandaRepository.findAllByTituloContainingIgnoreCase(titulo);
    }

    /**
     * Busca uma demanda específica pelo seu ID.
     *
     * @param id O ID da demanda.
     * @return Um Optional contendo a Demanda, se encontrada.
     */
    @Transactional(readOnly = true)
    public Optional<Demanda> buscarDemandaPorId(Long id) {
        return demandaRepository.findByIdWithInstituicao(id);
    }

    /**
     * Busca todas as demandas de uma instituição específica.
     * (Usado no painel "Meus Pedidos" da instituição).
     *
     * @param instituicaoId O ID da instituição.
     * @return Lista de demandas daquela instituição.
     */
    @Transactional(readOnly = true)
    public List<Demanda> buscarDemandasPorInstituicao(Long instituicaoId) {
        List<Demanda> todasDemandas = demandaRepository.findAllByInstituicaoId(instituicaoId);
        // Filtrar demandas inativas (deletadas logicamente)
        return todasDemandas.stream()
                .filter(d -> !"Inativo".equals(d.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * UC4 - Atualizar Doação (Demanda)
     * Atualiza os dados de uma demanda existente.
     *
     * @param demandaId      O ID da demanda a ser atualizada.
     * @param dadosAtualizados Objeto com os novos dados.
     * @return A Demanda atualizada.
     */
    @Transactional
    public Demanda atualizarDemanda(Long demandaId, Demanda dadosAtualizados) {
        // 1. Busca a demanda existente
        Demanda demandaExistente = demandaRepository.findById(demandaId)
                .orElseThrow(() -> new RuntimeException("Demanda não encontrada."));

        // 2. Atualiza os campos (exceto a instituição)
        demandaExistente.setTitulo(dadosAtualizados.getTitulo());
        demandaExistente.setCategoria(dadosAtualizados.getCategoria());
        demandaExistente.setDescricao(dadosAtualizados.getDescricao());
        demandaExistente.setQuantidadeDescricao(dadosAtualizados.getQuantidadeDescricao());
        demandaExistente.setStatus(dadosAtualizados.getStatus());
        demandaExistente.setNivelUrgencia(dadosAtualizados.getNivelUrgencia());
        demandaExistente.setPrazoDesejado(dadosAtualizados.getPrazoDesejado());
        demandaExistente.setMetaNumerica(dadosAtualizados.getMetaNumerica());

        // 3. Salva as alterações
        return demandaRepository.save(demandaExistente);
    }

    /**
     * UC4 - Excluir Doação (Demanda)
     * Realiza a exclusão lógica de uma demanda, conforme a Regra de Negócio.
     *
     * @param demandaId O ID da demanda a ser excluída.
     */
    @Transactional
    public void excluirDemanda(Long demandaId) {
        // Regra de Negócio: Exclusão preferencialmente deve ser lógica
        Demanda demanda = demandaRepository.findById(demandaId)
                .orElseThrow(() -> new RuntimeException("Demanda não encontrada."));
        
        // Em vez de deletar, mudamos o status
        demanda.setStatus("Inativo"); // ou "Excluído"
        demandaRepository.save(demanda);
    }
}