package com.mackenzie.achadosdoados.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração central de segurança para a aplicação Spring Boot.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Define um Bean para o PasswordEncoder, que será usado para
     * criptografar (hash) as senhas dos usuários.
     * Usamos o BCrypt, que é o padrão recomendado.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura a cadeia de filtros de segurança do Spring Security.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita o CSRF, pois usaremos uma API REST stateless (sem sessão)
            .csrf(csrf -> csrf.disable())
            
            // Configura a política de criação de sessão como STATELESS
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configura a autorização para as requisições HTTP
            .authorizeHttpRequests(auth -> auth
                // Permite acesso público a todos os endpoints por enquanto
                // TODO: Restringir endpoints no futuro (ex: /admin, /meuperfil)
                .anyRequest().permitAll() 
            );

        return http.build();
    }
}