package com.mackenzie.achadosdoados.controller;

import com.mackenzie.achadosdoados.model.Instituicao;
import com.mackenzie.achadosdoados.model.Usuario;
import com.mackenzie.achadosdoados.repository.UsuarioRepository;
import com.mackenzie.achadosdoados.service.ImageStorageService;
import com.mackenzie.achadosdoados.service.TokenService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller para gerenciar upload e download de imagens de perfil.
 */
@RestController
@RequestMapping("/api")
public class ImageController {

    private final ImageStorageService imageStorageService;
    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public ImageController(ImageStorageService imageStorageService, 
                          TokenService tokenService, 
                          UsuarioRepository usuarioRepository) {
        this.imageStorageService = imageStorageService;
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Upload de foto de perfil da instituição.
     * POST /api/portal/instituicoes/foto
     */
    @PostMapping("/portal/instituicoes/foto")
    public ResponseEntity<Map<String, String>> uploadFotoInstituicao(
            @RequestParam("foto") MultipartFile file,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        System.out.println("=== Upload foto - Authorization: " + (authorization != null ? "presente" : "AUSENTE"));
        
        // Validar autenticação
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            System.out.println("=== ERRO: Authorization header inválido");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        String token = authorization.substring("Bearer ".length());
        System.out.println("=== Token extraído: " + token.substring(0, Math.min(10, token.length())) + "...");
        
        Long userId = tokenService.getUserIdForToken(token);
        System.out.println("=== UserId do token: " + userId);
        
        if (userId == null) {
            System.out.println("=== ERRO: Token inválido ou expirado");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Usuario usuario = usuarioRepository.findById(userId).orElse(null);
        System.out.println("=== Usuario encontrado: " + (usuario != null ? usuario.getNome() : "NULL"));
        System.out.println("=== Tipo do usuario: " + (usuario != null ? usuario.getClass().getSimpleName() : "NULL"));
        
        if (!(usuario instanceof Instituicao)) {
            System.out.println("=== ERRO: Usuario não é instituição");
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Instituicao instituicao = (Instituicao) usuario;

        // Validar arquivo
        if (file.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Arquivo vazio");
            return ResponseEntity.badRequest().body(error);
        }

        // Validar tipo de arquivo
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Apenas imagens são permitidas");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Deletar foto antiga se existir
            if (instituicao.getFotoUrl() != null) {
                String oldFilename = instituicao.getFotoUrl().substring(instituicao.getFotoUrl().lastIndexOf("/") + 1);
                imageStorageService.delete(oldFilename);
            }

            // Salvar nova foto
            String filename = imageStorageService.store(file);
            String fotoUrl = "/api/images/" + filename;
            
            // Atualizar instituição
            instituicao.setFotoUrl(fotoUrl);
            usuarioRepository.save(instituicao);

            Map<String, String> response = new HashMap<>();
            response.put("fotoUrl", fotoUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erro ao salvar imagem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Servir imagens armazenadas.
     * GET /api/images/{filename}
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path file = imageStorageService.load(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                // Determinar tipo de conteúdo
                String contentType = "application/octet-stream";
                if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
