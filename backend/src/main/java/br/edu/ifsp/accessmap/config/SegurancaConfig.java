package br.edu.ifsp.accessmap.config;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

/**
 * Regras de acesso da API.
 * - Públicas: ler locais, plantas e categorias; enviar colaboração; fazer login.
 * - Restritas ao administrador (token JWT no cabeçalho Authorization): o resto de /api.
 * Como o token vai no cabeçalho (e não em cookie), não há sessão no servidor nem risco de CSRF.
 */
@Configuration
public class SegurancaConfig {

    private static final Logger log = LoggerFactory.getLogger(SegurancaConfig.class);

    @Bean
    SecurityFilterChain filtroSeguranca(HttpSecurity http) throws Exception {
        AuthenticationEntryPoint naoAutenticado = (req, res, ex) -> {
            res.setStatus(401);
            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
            res.setCharacterEncoding("UTF-8");
            res.getWriter().write("{\"mensagem\":\"Sua sessão expirou. Faça login novamente.\"}");
        };

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/colaboracoes").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/pontos", "/api/plantas", "/api/plantas/**", "/api/categorias").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll())
            .oauth2ResourceServer(o -> o
                .authenticationEntryPoint(naoAutenticado)
                .jwt(Customizer.withDefaults()))
            .exceptionHandling(e -> e.authenticationEntryPoint(naoAutenticado));

        return http.build();
    }

    @Bean
    SecretKey chaveJwt(AccessmapProperties props) {
        String segredo = props.jwt().segredo();
        byte[] bytes;
        if (segredo == null || segredo.isBlank()) {
            bytes = new byte[32];
            new SecureRandom().nextBytes(bytes);
            log.warn("accessmap.jwt.segredo não definido: usando um segredo aleatório (logins expiram ao reiniciar).");
        } else {
            bytes = segredo.getBytes(StandardCharsets.UTF_8);
            if (bytes.length < 32) {
                throw new IllegalStateException("accessmap.jwt.segredo precisa ter pelo menos 32 caracteres.");
            }
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey chave) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(chave));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey chave) {
        return NimbusJwtDecoder.withSecretKey(chave).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** Libera a API para o front servido em outra porta durante o desenvolvimento. */
    @Bean
    CorsConfigurationSource corsConfigurationSource(AccessmapProperties props) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(props.cors().origens() == null ? List.of() : props.cors().origens());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource fonte = new UrlBasedCorsConfigurationSource();
        fonte.registerCorsConfiguration("/api/**", config);
        return fonte;
    }
}
