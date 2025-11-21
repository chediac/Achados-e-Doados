package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.repository.DoadorRepository;
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
class DoadorServiceTest {

    @Mock
    private DoadorRepository doadorRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DoadorService doadorService;

    @Test
    void deveCriptografarSenhaAoCadastrar() {
        Doador doador = new Doador();
        doador.setNome("João");
        doador.setEmail("joao@example.com");
        doador.setSenha("123456");
        when(usuarioRepository.findByEmail("joao@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("123456")).thenReturn("senha-hash");
        when(doadorRepository.save(any(Doador.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Doador salvo = doadorService.cadastrarDoador(doador);

        assertEquals("senha-hash", salvo.getSenha());
        verify(doadorRepository).save(doador);
    }

    @Test
    void deveLancarExcecaoQuandoEmailJaExiste() {
        when(usuarioRepository.findByEmail("joao@example.com")).thenReturn(Optional.of(new Doador()));

        Doador doador = new Doador();
        doador.setNome("João");
        doador.setEmail("joao@example.com");
        doador.setSenha("123456");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> doadorService.cadastrarDoador(doador));

        assertTrue(ex.getMessage().contains("Usuário já existente"));
        verify(doadorRepository, never()).save(any());
    }
}
