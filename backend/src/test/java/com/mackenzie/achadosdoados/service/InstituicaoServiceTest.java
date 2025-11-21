package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstituicaoServiceTest {

    @Mock
    private InstituicaoRepository instituicaoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private InstituicaoService instituicaoService;

    @Test
    void deveCadastrarInstituicaoComSenhaCriptografada() {
        Instituicao instituicao = novaInstituicao();
        when(usuarioRepository.findByEmail("contato@casadobem.org")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("segredo")).thenReturn("hash");
        when(instituicaoRepository.save(any(Instituicao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Instituicao salvo = instituicaoService.cadastrarInstituicao(instituicao);

        assertEquals("hash", salvo.getSenha());
        verify(instituicaoRepository).save(instituicao);
    }

    @Test
    void deveLancarExcecaoQuandoCamposObrigatoriosAusentes() {
        Instituicao incompleta = new Instituicao();

        RuntimeException ex = assertThrows(RuntimeException.class, () -> instituicaoService.cadastrarInstituicao(incompleta));

        assertTrue(ex.getMessage().contains("Dados inválidos"));
        verifyNoInteractions(instituicaoRepository);
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
