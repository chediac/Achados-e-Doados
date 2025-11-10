package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.service.DemandaService;
import com.mackenzie.achadosdoados.service.TokenService;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import com.mackenzie.achadosdoados.model.Usuario;
import com.mackenzie.achadosdoados.model.Instituicao;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller para o "Portal da Instituição".
 * Gerencia o CRUD de Demandas (UC4) para uma instituição específica.
 * Todos os endpoints aqui devem ser protegidos.
 */
@RestController
@RequestMapping("/api/portal/instituicoes/{instituicaoId}/demandas")
public class PortalInstituicaoController {

    private final DemandaService demandaService;
    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public PortalInstituicaoController(DemandaService demandaService, TokenService tokenService, UsuarioRepository usuarioRepository) {
        this.demandaService = demandaService;
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * UC4 - Criar Doação (Demanda).
     * Responde a: POST /api/portal/instituicoes/1/demandas
     *
     * @param instituicaoId O ID da instituição logada.
     * @param demanda       Os dados da nova demanda.
     * @return A demanda criada.
     */
    @PostMapping
    public ResponseEntity<Demanda> criarDemanda(
            @PathVariable Long instituicaoId,
            @RequestBody Demanda demanda,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", required = false) String authorization) {

        // Segurança básica de desenvolvimento: verifica se o token pertence à instituição
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String token = authorization.substring("Bearer ".length());
        Long userId = tokenService.getUserIdForToken(token);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Usuario usuario = usuarioRepository.findById(userId).orElse(null);
        if (!(usuario instanceof Instituicao) || !usuario.getId().equals(instituicaoId)) {
            // token não pertence à instituição informada na URL
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Demanda novaDemanda = demandaService.criarDemanda(demanda, instituicaoId);
        return new ResponseEntity<>(novaDemanda, HttpStatus.CREATED);
    }

    /**
     * UC4 - Visualizar Doações (Demandas).
     * Lista todas as demandas de uma instituição (Painel "Meus Pedidos").
     * Responde a: GET /api/portal/instituicoes/1/demandas
     *
     * @param instituicaoId O ID da instituição logada.
     * @return Lista de demandas da instituição.
     */
    @GetMapping
    public ResponseEntity<List<Demanda>> listarDemandasDaInstituicao(
            @PathVariable Long instituicaoId) {
        // do usuário autenticado no token.
        List<Demanda> demandas = demandaService.buscarDemandasPorInstituicao(instituicaoId);
        return ResponseEntity.ok(demandas);
    }

    /**
     * UC4 - Atualizar Doação (Demanda).
     * Responde a: PUT /api/portal/instituicoes/1/demandas/5
     *
     * @param instituicaoId  O ID da instituição logada.
     * @param demandaId      O ID da demanda a ser alterada.
     * @param dadosAtualizados Os novos dados da demanda.
     * @return A demanda atualizada.
     */
    @PutMapping("/{demandaId}")
    public ResponseEntity<Demanda> atualizarDemanda(
            @PathVariable Long instituicaoId,
            @PathVariable Long demandaId,
            @RequestBody Demanda dadosAtualizados,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", required = false) String authorization) {
        
        // Validar autenticação
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String token = authorization.substring("Bearer ".length());
        Long userId = tokenService.getUserIdForToken(token);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Validar que o usuário é instituição
        Usuario usuario = usuarioRepository.findById(userId).orElse(null);
        if (!(usuario instanceof Instituicao) || !usuario.getId().equals(instituicaoId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Validar que a demanda pertence à instituição
        Demanda demandaExistente = demandaService.buscarDemandaPorId(demandaId).orElse(null);
        if (demandaExistente == null || !demandaExistente.getInstituicao().getId().equals(instituicaoId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Demanda demanda = demandaService.atualizarDemanda(demandaId, dadosAtualizados);
        return ResponseEntity.ok(demanda);
    }

    /**
     * UC4 - Excluir Doação (Demanda).
     * Responde a: DELETE /api/portal/instituicoes/1/demandas/5
     *
     * @param instituicaoId O ID da instituição logada.
     * @param demandaId     O ID da demanda a ser excluída.
     * @return Status 204 (No Content).
     */
    @DeleteMapping("/{demandaId}")
    public ResponseEntity<Void> excluirDemanda(
            @PathVariable Long instituicaoId,
            @PathVariable Long demandaId,
            @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", required = false) String authorization) {
        
        // Validar autenticação
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String token = authorization.substring("Bearer ".length());
        Long userId = tokenService.getUserIdForToken(token);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Validar que o usuário é instituição
        Usuario usuario = usuarioRepository.findById(userId).orElse(null);
        if (!(usuario instanceof Instituicao) || !usuario.getId().equals(instituicaoId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Validar que a demanda pertence à instituição
        Demanda demandaExistente = demandaService.buscarDemandaPorId(demandaId).orElse(null);
        if (demandaExistente == null || !demandaExistente.getInstituicao().getId().equals(instituicaoId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        demandaService.excluirDemanda(demandaId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}