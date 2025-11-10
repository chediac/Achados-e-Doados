package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.repository.DoadorRepository;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Classe de serviço para gerenciar a lógica de negócio do Doador.
 * Implementa o Caso de Uso 2 - Cadastrar Usuário.
 */
@Service
public class DoadorService {

    private final DoadorRepository doadorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DoadorService(DoadorRepository doadorRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.doadorRepository = doadorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Doador cadastrarDoador(Doador doador) {
        if (doador.getNome() == null || doador.getNome().isEmpty() ||
            doador.getEmail() == null || doador.getEmail().isEmpty() ||
            doador.getSenha() == null || doador.getSenha().isEmpty()) {
            throw new RuntimeException("Dados inválidos ou ausentes. Campos obrigatórios não podem ser nulos.");
        }

        if (usuarioRepository.findByEmail(doador.getEmail()).isPresent()) {
            throw new RuntimeException("Usuário já existente. Já existe conta com o e-mail informado.");
        }

        String senhaCriptografada = passwordEncoder.encode(doador.getSenha());
        doador.setSenha(senhaCriptografada);

        return doadorRepository.save(doador);
    }
}