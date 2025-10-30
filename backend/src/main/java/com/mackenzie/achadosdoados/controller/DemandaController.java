package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.service.DemandaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller focado nos endpoints públicos de busca de Demandas (UC1).
 */
@RestController
@RequestMapping("/api/demandas")
public class DemandaController {

    private final DemandaService demandaService;

    public DemandaController(DemandaService demandaService) {
        this.demandaService = demandaService;
    }

    /**
     * Endpoint para o Caso de Uso 1: Buscar demanda.
     * Busca todas as demandas ativas ou filtra pelo título.
     * Responde a:
     * - GET /api/demandas (retorna todas)
     * - GET /api/demandas?titulo=roupas (retorna filtradas)
     *
     * @param titulo Parâmetro opcional para filtrar pelo título da demanda.
     * @return Uma lista de demandas e status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Demanda>> buscarDemandas(
            @RequestParam(required = false) String titulo) {
        
        List<Demanda> demandas;
        
        if (titulo != null && !titulo.isEmpty()) {
            // Fluxo com filtro (barra de busca)
            demandas = demandaService.buscarDemandasPorTitulo(titulo);
        } else {
            // Fluxo sem filtro (carregamento inicial)
            demandas = demandaService.buscarTodasDemandas();
        }
        
        return ResponseEntity.ok(demandas);
    }

    /**
     * Endpoint para buscar uma demanda específica pelo ID.
     * Útil para carregar a página de detalhes da demanda.
     * Responde a: GET /api/demandas/1
     *
     * @param id O ID da demanda (vem da URL).
     * @return A demanda encontrada com status 200 (OK) ou 404 (Not Found).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Demanda> buscarDemandaPorId(@PathVariable Long id) {
        return demandaService.buscarDemandaPorId(id)
                .map(demanda -> ResponseEntity.ok(demanda)) // Encontrou -> 200 OK
                .orElse(ResponseEntity.notFound().build()); // Não encontrou -> 404 Not Found
    }

    // Os endpoints de Criar, Atualizar e Deletar (UC4)
    // ficarão em um controller separado (ex: InstituicaoController)
    // pois exigem autenticação de Instituição.
}