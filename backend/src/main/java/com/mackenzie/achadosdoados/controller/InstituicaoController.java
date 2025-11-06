package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller público para consultar instituições.
 */
@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoRepository instituicaoRepository;

    public InstituicaoController(InstituicaoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Instituicao>> listarTodas() {
        List<Instituicao> lista = instituicaoRepository.findAll();
        return ResponseEntity.ok(lista);
    }
}
