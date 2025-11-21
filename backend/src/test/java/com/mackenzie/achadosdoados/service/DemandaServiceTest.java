package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Demanda;
import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.DemandaRepository;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DemandaServiceTest {

    @Mock
    private DemandaRepository demandaRepository;

    @Mock
    private InstituicaoRepository instituicaoRepository;

    @InjectMocks
    private DemandaService demandaService;

    @Test
    void deveCriarDemandaComStatusPadraoQuandoDadosValidos() {
        Demanda demanda = novaDemanda();
        Instituicao instituicao = novaInstituicao();
        when(instituicaoRepository.findById(1L)).thenReturn(Optional.of(instituicao));
        when(demandaRepository.save(any(Demanda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Demanda resultado = demandaService.criarDemanda(demanda, 1L);

        assertSame(instituicao, resultado.getInstituicao());
        assertEquals("Ativo", resultado.getStatus());
        verify(demandaRepository).save(demanda);
    }

    @Test
    void deveLancarExcecaoQuandoCamposObrigatoriosAusentes() {
        Demanda demanda = new Demanda();

        RuntimeException ex = assertThrows(RuntimeException.class, () -> demandaService.criarDemanda(demanda, 1L));

        assertTrue(ex.getMessage().contains("Dados inválidos"));
        verifyNoInteractions(instituicaoRepository);
        verifyNoInteractions(demandaRepository);
    }

    @Test
    void deveLancarExcecaoQuandoInstituicaoNaoExiste() {
        Demanda demanda = novaDemanda();
        when(instituicaoRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> demandaService.criarDemanda(demanda, 99L));

        assertTrue(ex.getMessage().contains("Instituição não encontrada"));
    }

    @Test
    void deveFiltrarDemandasInativasAoBuscarTodas() {
        Demanda ativa = novaDemanda();
        ativa.setStatus("Ativo");
        Demanda inativa = novaDemanda();
        inativa.setStatus("Inativo");
        when(demandaRepository.findAllWithInstituicao()).thenReturn(Arrays.asList(ativa, inativa));

        assertEquals(1, demandaService.buscarTodasDemandas().size());
    }

    @Test
    void deveMarcarDemandaComoInativaAoExcluir() {
        Demanda demanda = novaDemanda();
        demanda.setStatus("Ativo");
        when(demandaRepository.findById(5L)).thenReturn(Optional.of(demanda));
        when(demandaRepository.save(any(Demanda.class))).thenAnswer(invocation -> invocation.getArgument(0));

        demandaService.excluirDemanda(5L);

        ArgumentCaptor<Demanda> captor = ArgumentCaptor.forClass(Demanda.class);
        verify(demandaRepository).save(captor.capture());
        assertEquals("Inativo", captor.getValue().getStatus());
    }

    private Demanda novaDemanda() {
        Demanda demanda = new Demanda();
        demanda.setTitulo("Roupas de inverno");
        demanda.setCategoria("Roupas");
        demanda.setDescricao("Precisamos de casacos e luvas");
        demanda.setQuantidadeDescricao("50 itens");
        demanda.setNivelUrgencia("Alta");
        demanda.setPrazoDesejado(LocalDate.now().plusDays(10));
        demanda.setMetaNumerica(50);
        return demanda;
    }

    private Instituicao novaInstituicao() {
        Instituicao instituicao = new Instituicao();
        instituicao.setNome("Casa do Bem");
        instituicao.setEmail("contato@casadobem.org");
        instituicao.setSenha("segredo");
        instituicao.setEndereco("Rua A, 123");
        instituicao.setTelefone("1122334455");
        return instituicao;
    }
}
