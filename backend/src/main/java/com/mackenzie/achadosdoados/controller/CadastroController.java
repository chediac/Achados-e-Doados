package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.service.DoadorService;
import com.mackenzie.achadosdoados.service.InstituicaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

/**
 * Controller focado nos endpoints públicos de cadastro
 * (UC2 - Cadastrar Usuário e UC3 - Cadastrar Instituição).
 */
@RestController
@RequestMapping("/api/cadastro") // Prefixo da URL para este controller
public class CadastroController {

    private final DoadorService doadorService;
    private final InstituicaoService instituicaoService;

    // Injeta os serviços de que este controller precisa
    public CadastroController(DoadorService doadorService, InstituicaoService instituicaoService) {
        this.doadorService = doadorService;
        this.instituicaoService = instituicaoService;
    }

    /**
     * Endpoint para o Caso de Uso 2: Cadastrar Usuário (Doador).
     * Responde a requisições POST em /api/cadastro/doador
     *
     * @param doador Os dados do doador (JSON) vindos do corpo da requisição.
     * @return O doador criado com status 201 (Created).
     */
    @PostMapping("/doador")
    public ResponseEntity<?> cadastrarDoador(@RequestBody Doador doador) {
        try {
            Doador novoDoador = doadorService.cadastrarDoador(doador);
            // Remove a senha da resposta por segurança
            novoDoador.setSenha(null);
            return new ResponseEntity<>(novoDoador, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Endpoint para o Caso de Uso 3: Cadastrar Instituição.
     * Responde a requisições POST em /api/cadastro/instituicao
     *
     * @param instituicao Os dados da instituição (JSON) vindos do corpo da requisição.
     * @return A instituição criada com status 201 (Created).
     */
    @PostMapping("/instituicao")
    public ResponseEntity<?> cadastrarInstituicao(@RequestBody Instituicao instituicao) {
        try {
            Instituicao novaInstituicao = instituicaoService.cadastrarInstituicao(instituicao);
            // Remove a senha da resposta por segurança
            novaInstituicao.setSenha(null);
            return new ResponseEntity<>(novaInstituicao, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Tratamento global de exceções para este controller
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Erro interno do servidor: " + e.getMessage()));
    }
}
