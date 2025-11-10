package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Classe de serviço para gerenciar a lógica de negócio da Instituicao.
 * Implementa o Caso de Uso 3 - Cadastrar Instituição.
 */
@Service
public class InstituicaoService {

    private static final Logger logger = LoggerFactory.getLogger(InstituicaoService.class);

    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Injeção de dependência via construtor
    public InstituicaoService(InstituicaoRepository instituicaoRepository,
                              UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Cadastra uma nova Instituicao no sistema.
     * Implementa as Regras de Negócio do UC3.
     *
     * @param instituicao O objeto Instituicao a ser salvo.
     * @return A Instituicao salva com ID.
     * @throws RuntimeException se as regras de negócio falharem.
     */
    @Transactional
    public Instituicao cadastrarInstituicao(Instituicao instituicao) {
        logger.info("cadastrarInstituicao called with nome='{}', email='{}', senha='{}', endereco='{}', telefone='{}'",
            instituicao != null ? instituicao.getNome() : null,
            instituicao != null ? instituicao.getEmail() : null,
            instituicao != null ? (instituicao.getSenha() != null ? "***" : null) : null,
            instituicao != null ? instituicao.getEndereco() : null,
            instituicao != null ? instituicao.getTelefone() : null);

        if (instituicao.getNome() == null || instituicao.getNome().isEmpty() ||
            instituicao.getEmail() == null || instituicao.getEmail().isEmpty() ||
            instituicao.getSenha() == null || instituicao.getSenha().isEmpty() ||
            instituicao.getEndereco() == null || instituicao.getEndereco().isEmpty() ||
            instituicao.getTelefone() == null || instituicao.getTelefone().isEmpty()) {
            throw new RuntimeException("Dados inválidos ou ausentes. Campos obrigatórios não podem ser nulos.");
        }

        if (usuarioRepository.findByEmail(instituicao.getEmail()).isPresent()) {
            throw new RuntimeException("Instituição já cadastrada. Já existe conta com o e-mail informado.");
        }

        String senhaCriptografada = passwordEncoder.encode(instituicao.getSenha());
        instituicao.setSenha(senhaCriptografada);

        return instituicaoRepository.save(instituicao);
    }
}