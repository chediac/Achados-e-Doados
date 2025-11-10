package com.mackenzie.achadosdoados.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Configuração central de segurança para a aplicação Spring Boot.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed.origins:}")
    private String corsAllowedOrigins;

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
     * Configura CORS para permitir requisições do frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> defaultOrigins = Arrays.asList(
            "http://localhost:5173",
            "https://localhost:5173",
            "http://127.0.0.1:5173",
            "https://127.0.0.1:5173",
            "http://localhost:3000"
        );

        List<String> allowedOrigins = parseAllowedOrigins(corsAllowedOrigins);

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins.isEmpty() ? defaultOrigins : allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private List<String> parseAllowedOrigins(String originsProperty) {
        if (originsProperty == null || originsProperty.isBlank()) {
            return Collections.emptyList();
        }

        return Stream.of(originsProperty.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .collect(Collectors.toList());
    }

    /**
     * Configura a cadeia de filtros de segurança do Spring Security.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Habilita CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
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