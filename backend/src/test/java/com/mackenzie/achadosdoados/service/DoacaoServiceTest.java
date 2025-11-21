package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.model.Doacao;
import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.repository.DemandaRepository;
import com.mackenzie.achadosdoados.repository.DoacaoRepository;
import com.mackenzie.achadosdoados.repository.DoadorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoacaoServiceTest {

    @Mock
    private DoacaoRepository doacaoRepository;

    @Mock
    private DoadorRepository doadorRepository;

    @Mock
    private DemandaRepository demandaRepository;

    @InjectMocks
    private DoacaoService doacaoService;

    @Test
    void deveRegistrarIntencaoComDadosBasicos() {
        Doador doador = new Doador();
        Demanda demanda = new Demanda();
        when(doadorRepository.findById(1L)).thenReturn(Optional.of(doador));
        when(demandaRepository.findById(2L)).thenReturn(Optional.of(demanda));
        when(doacaoRepository.save(any(Doacao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Doacao doacao = doacaoService.registrarIntencaoDeDoacao(1L, 2L);

        assertSame(doador, doacao.getDoador());
        assertSame(demanda, doacao.getDemanda());
        assertEquals("Aguardando", doacao.getStatus());
        assertNotNull(doacao.getData());
    }

    @Test
    void deveLancarExcecaoQuandoDoadorNaoEncontrado() {
        when(doadorRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> doacaoService.registrarIntencaoDeDoacao(1L, 2L));

        assertTrue(ex.getMessage().contains("Doador"));
    }

    @Test
    void deveAtualizarStatusDaDoacao() {
        Doacao doacao = new Doacao();
        doacao.setStatus("Aguardando");
        when(doacaoRepository.findById(10L)).thenReturn(Optional.of(doacao));
        when(doacaoRepository.save(doacao)).thenReturn(doacao);

        Doacao atualizado = doacaoService.atualizarStatusDoacao(10L, "Recebida");

        assertEquals("Recebida", atualizado.getStatus());
        verify(doacaoRepository).save(doacao);
    }
}
