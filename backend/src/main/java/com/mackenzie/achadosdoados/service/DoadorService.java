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

    // Injeção de dependência via construtor (melhor prática)
    public DoadorService(DoadorRepository doadorRepository,
                         UsuarioRepository usuarioRepository,
                         PasswordEncoder passwordEncoder) {
        this.doadorRepository = doadorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Cadastra um novo Doador no sistema.
     * Implementa as Regras de Negócio do UC2.
     *
     * @param doador O objeto Doador a ser salvo.
     * @return O Doador salvo com ID.
     * @throws RuntimeException se as regras de negócio falharem.
     */
    @Transactional // Garante que a operação seja atômica (ou salva tudo ou nada)
    public Doador cadastrarDoador(Doador doador) {
        // Regra de Negócio: Campos obrigatórios não podem ser nulos 
        if (doador.getNome() == null || doador.getNome().isEmpty() ||
            doador.getEmail() == null || doador.getEmail().isEmpty() ||
            doador.getSenha() == null || doador.getSenha().isEmpty()) {
            throw new RuntimeException("Dados inválidos ou ausentes. Campos obrigatórios não podem ser nulos.");
        }

        // Regra de Negócio: O e-mail deve ser único na plataforma 
        if (usuarioRepository.findByEmail(doador.getEmail()).isPresent()) {
            throw new RuntimeException("Usuário já existente. Já existe conta com o e-mail informado.");
        }

        // Regra de Negócio: A senha deve ser criptografada (RNF Segurança) 
        String senhaCriptografada = passwordEncoder.encode(doador.getSenha());
        doador.setSenha(senhaCriptografada);

        // 5. O sistema armazena as informações e cria o novo usuário [cite: 304]
        return doadorRepository.save(doador);
    }

    // TODO: Adicionar métodos para buscar, atualizar e deletar doadores.
}