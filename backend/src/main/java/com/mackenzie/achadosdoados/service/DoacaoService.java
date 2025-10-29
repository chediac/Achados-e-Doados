package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.model.Doacao;
import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.repository.DemandaRepository;
import com.mackenzie.achadosdoados.repository.DoacaoRepository;
import com.mackenzie.achadosdoados.repository.DoadorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Classe de serviço para gerenciar a lógica de negócio das Doações
 * (intenções de doação).
 */
@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;
    private final DoadorRepository doadorRepository;
    private final DemandaRepository demandaRepository;

    public DoacaoService(DoacaoRepository doacaoRepository, DoadorRepository doadorRepository, DemandaRepository demandaRepository) {
        this.doacaoRepository = doacaoRepository;
        this.doadorRepository = doadorRepository;
        this.demandaRepository = demandaRepository;
    }

    /**
     * RF - Registrar a intenção de uma doação.
     * Cria um novo registro de Doacao, conectando um Doador a uma Demanda.
     *
     * @param doadorId  O ID do Doador que está realizando a doação.
     * @param demandaId O ID da Demanda que está sendo atendida.
     * @return A Doacao registrada.
     */
    @Transactional
    public Doacao registrarIntencaoDeDoacao(Long doadorId, Long demandaId) {
        // 1. Buscar as entidades
        Doador doador = doadorRepository.findById(doadorId)
                .orElseThrow(() -> new RuntimeException("Doador não encontrado."));
        
        Demanda demanda = demandaRepository.findById(demandaId)
                .orElseThrow(() -> new RuntimeException("Demanda não encontrada."));

        // 2. Criar a nova doação
        Doacao novaDoacao = new Doacao();
        novaDoacao.setDoador(doador);
        novaDoacao.setDemanda(demanda);
        novaDoacao.setData(LocalDateTime.now()); // Registra data e hora atuais
        novaDoacao.setStatus("Aguardando"); // Status inicial

        // 3. Salvar no banco
        return doacaoRepository.save(novaDoacao);
    }

    /**
     * Atualiza o status de uma doação (ex: "Aguardando" -> "Recebida").
     * Ação realizada pela Instituição.
     *
     * @param doacaoId   O ID da doação a ser atualizada.
     * @param novoStatus O novo status (ex: "Recebida", "Cancelada").
     * @return A Doacao atualizada.
     */
    @Transactional
    public Doacao atualizarStatusDoacao(Long doacaoId, String novoStatus) {
        Doacao doacao = doacaoRepository.findById(doacaoId)
                .orElseThrow(() -> new RuntimeException("Doação não encontrada."));

        // TODO: Adicionar lógica de segurança para verificar se a instituição
        // logada é a "dona" desta doação (via demanda).

        doacao.setStatus(novoStatus);
        return doacaoRepository.save(doacao);
    }

    /**
     * Busca todas as doações de um Doador específico (para seu "Meu Perfil").
     *
     * @param doadorId O ID do Doador.
     * @return Lista de doações.
     */
    @Transactional(readOnly = true)
    public List<Doacao> buscarDoacoesPorDoador(Long doadorId) {
        return doacaoRepository.findAllByDoadorId(doadorId);
    }

    /**
     * Busca todas as doações recebidas por uma Instituição
     * (para o painel "Doações Recebidas").
     *
     * @param instituicaoId O ID da Instituição.
     * @return Lista de doações.
     */
    @Transactional(readOnly = true)
    public List<Doacao> buscarDoacoesPorInstituicao(Long instituicaoId) {
        return doacaoRepository.findAllByDemandaInstituicaoId(instituicaoId);
    }
}