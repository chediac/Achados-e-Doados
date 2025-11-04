package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Doador;
import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.model.Usuario;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Mapa simples em memória que associa tokens (UUID) a userId — suficiente para dev
    private static final ConcurrentHashMap<String, Long> tokenStore = new ConcurrentHashMap<>();

    // DTO simples para receber o body
    public static class LoginRequest {
        public String email;
        public String senha;

        public LoginRequest() {}
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req == null || req.email == null || req.senha == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "E-mail e senha são obrigatórios"));
        }

        Optional<Usuario> uopt = usuarioRepository.findByEmail(req.email);
        if (uopt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
        }

        Usuario usuario = uopt.get();
        if (!passwordEncoder.matches(req.senha, usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
        }

        // Gera um token simples (UUID) para desenvolvimento.
        String token = UUID.randomUUID().toString();

        // Armazena mapeamento token -> userId (simples; não persistente)
        tokenStore.put(token, usuario.getId());

    // define tipo (DOADOR / INSTITUICAO) para o frontend
    String tipo = "USUARIO";
    if (usuario instanceof Instituicao) tipo = "INSTITUICAO";
    else if (usuario instanceof Doador) tipo = "DOADOR";

    Map<String, Object> user = new HashMap<>();
    user.put("id", usuario.getId());
    user.put("nome", usuario.getNome());
    user.put("email", usuario.getEmail());
    user.put("tipo", tipo);

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("user", user);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String token = body != null ? body.get("token") : null;
        if (token != null) tokenStore.remove(token);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping("/me")
    public ResponseEntity<?> me(org.springframework.web.context.request.WebRequest webRequest) {
        String auth = webRequest.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token ausente"));
        }
        String token = auth.substring("Bearer ".length());
        Long userId = tokenStore.get(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido"));
        }
        Optional<Usuario> uopt = usuarioRepository.findById(userId);
        if (uopt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Usuário não encontrado"));
        }
        Usuario usuario = uopt.get();
        String tipo = "USUARIO";
        if (usuario instanceof Instituicao) tipo = "INSTITUICAO";
        else if (usuario instanceof Doador) tipo = "DOADOR";

        Map<String, Object> user = new HashMap<>();
        user.put("id", usuario.getId());
        user.put("nome", usuario.getNome());
        user.put("email", usuario.getEmail());
        user.put("tipo", tipo);
        return ResponseEntity.ok(user);
    }
}
