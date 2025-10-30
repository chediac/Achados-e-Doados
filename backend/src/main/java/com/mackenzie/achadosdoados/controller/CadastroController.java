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
    public ResponseEntity<Doador> cadastrarDoador(@RequestBody Doador doador) {
        Doador novoDoador = doadorService.cadastrarDoador(doador);
        // Retorna 201 Created com o objeto salvo no corpo da resposta
        return new ResponseEntity<>(novoDoador, HttpStatus.CREATED);
    }

    /**
     * Endpoint para o Caso de Uso 3: Cadastrar Instituição.
     * Responde a requisições POST em /api/cadastro/instituicao
     *
     * @param instituicao Os dados da instituição (JSON) vindos do corpo da requisição.
     * @return A instituição criada com status 201 (Created).
     */
    @PostMapping("/instituicao")
    public ResponseEntity<Instituicao> cadastrarInstituicao(@RequestBody Instituicao instituicao) {
        Instituicao novaInstituicao = instituicaoService.cadastrarInstituicao(instituicao);
        // Retorna 201 Created com o objeto salvo no corpo da resposta
        return new ResponseEntity<>(novaInstituicao, HttpStatus.CREATED);
    }

    // TODO: Adicionar tratamento de exceções (ex: @ExceptionHandler)
    // para retornar 400 Bad Request em caso de e-mail duplicado, em vez de 500.
}