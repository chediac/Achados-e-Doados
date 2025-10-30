package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Doacao;
import com.mackenzie.achadosdoados.service.DoacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para gerenciar o registro e o ciclo de vida das Doações
 * (intenções de doação).
 */
@RestController
@RequestMapping("/api/doacoes")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    /**
     * RF - Registrar a intenção de uma doação.
     * Responde a: POST /api/doacoes?doadorId=1&demandaId=5
     *
     * @param doadorId  O ID do Doador (usuário logado).
     * @param demandaId O ID da Demanda que ele quer atender.
     * @return A nova Doacao criada com status 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Doacao> registrarIntencaoDeDoacao(
            @RequestParam Long doadorId,
            @RequestParam Long demandaId) {
        // TODO: Na implementação final, o 'doadorId' deve ser obtido
        // do principal de segurança (usuário autenticado), não de um parâmetro.
        Doacao novaDoacao = doacaoService.registrarIntencaoDeDoacao(doadorId, demandaId);
        return new ResponseEntity<>(novaDoacao, HttpStatus.CREATED);
    }

    /**
     * Atualiza o status de uma doação (Ação da Instituição).
     * Responde a: PUT /api/doacoes/10/status?status=Recebida
     *
     * @param doacaoId O ID da doação a ser atualizada.
     * @param status   O novo status.
     * @return A Doacao atualizada com status 200 (OK).
     */
    @PutMapping("/{doacaoId}/status")
    public ResponseEntity<Doacao> atualizarStatusDoacao(
            @PathVariable Long doacaoId,
            @RequestParam String status) {
        // TODO: Adicionar verificação de segurança para garantir que
        // a instituição logada é a dona desta doação.
        Doacao doacaoAtualizada = doacaoService.atualizarStatusDoacao(doacaoId, status);
        return ResponseEntity.ok(doacaoAtualizada);
    }

    /**
     * Busca o histórico de doações de um Doador específico.
     * Responde a: GET /api/doacoes/doador/1
     *
     * @param doadorId O ID do Doador.
     * @return Lista de doações e status 200 (OK).
     */
    @GetMapping("/doador/{doadorId}")
    public ResponseEntity<List<Doacao>> buscarDoacoesPorDoador(@PathVariable Long doadorId) {
        // TODO: Adicionar verificação de segurança (só o próprio doador pode ver).
        List<Doacao> doacoes = doacaoService.buscarDoacoesPorDoador(doadorId);
        return ResponseEntity.ok(doacoes);
    }

    /**
     * Busca as doações recebidas por uma Instituição.
     * Usado no painel "Doações Recebidas".
     * Responde a: GET /api/doacoes/instituicao/1
     *
     * @param instituicaoId O ID da Instituição.
     * @return Lista de doações e status 200 (OK).
     */
    @GetMapping("/instituicao/{instituicaoId}")
    public ResponseEntity<List<Doacao>> buscarDoacoesPorInstituicao(@PathVariable Long instituicaoId) {
        // TODO: Adicionar verificação de segurança (só a própria instituição pode ver).
        List<Doacao> doacoes = doacaoService.buscarDoacoesPorInstituicao(instituicaoId);
        return ResponseEntity.ok(doacoes);
    }
}