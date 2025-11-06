package com.mackenzie.achadosdoados.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

/**
 * Serviço simples para gerenciar tokens em memória durante o desenvolvimento.
 */
@Service
public class TokenService {

    private final ConcurrentHashMap<String, Long> tokenStore = new ConcurrentHashMap<>();

    /**
     * Gera e armazena um token para o userId informado.
     */
    public String generateToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, userId);
        return token;
    }

    /**
     * Recupera o userId associado a um token, ou null se inválido.
     */
    public Long getUserIdForToken(String token) {
        if (token == null) return null;
        return tokenStore.get(token);
    }

    /**
     * Remove um token (logout).
     */
    public void invalidateToken(String token) {
        if (token != null) tokenStore.remove(token);
    }
}
