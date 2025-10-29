package com.mackenzie.achadosdoados.service;

import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.repository.InstituicaoRepository;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Classe de serviço para gerenciar a lógica de negócio da Instituicao.
 * Implementa o Caso de Uso 3 - Cadastrar Instituição.
 */
@Service
public class InstituicaoService {

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
        // Regra de Negócio: Campos obrigatórios não podem ser nulos 
        // Incluindo campos da classe base Usuario e da própria Instituicao
        if (instituicao.getNome() == null || instituicao.getNome().isEmpty() ||
            instituicao.getEmail() == null || instituicao.getEmail().isEmpty() ||
            instituicao.getSenha() == null || instituicao.getSenha().isEmpty() ||
            instituicao.getEndereco() == null || instituicao.getEndereco().isEmpty() ||
            instituicao.getTelefone() == null || instituicao.getTelefone().isEmpty()) {
            // Corresponde ao Fluxo Alternativo A1 - Dados inválidos ou incompletos 
            throw new RuntimeException("Dados inválidos ou ausentes. Campos obrigatórios não podem ser nulos.");
        }

        // Regra de Negócio: O e-mail deve ser único
        // (Adaptado da regra "CNPJ deve ser válido e único",
        // pois em nosso modelo o e-mail é o identificador único de login)
        if (usuarioRepository.findByEmail(instituicao.getEmail()).isPresent()) {
            // Corresponde ao Fluxo Alternativo A2 - Instituição já cadastrada 
            throw new RuntimeException("Instituição já cadastrada. Já existe conta com o e-mail informado.");
        }

        // RNF Segurança: A senha deve ser criptografada
        String senhaCriptografada = passwordEncoder.encode(instituicao.getSenha());
        instituicao.setSenha(senhaCriptografada);

        // 5. O sistema armazena as informações da instituição 
        return instituicaoRepository.save(instituicao);
    }

    // TODO: Adicionar métodos para buscar, atualizar e deletar instituições.
}