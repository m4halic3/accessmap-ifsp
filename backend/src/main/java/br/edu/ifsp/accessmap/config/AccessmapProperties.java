package br.edu.ifsp.accessmap.config;

import java.nio.file.Path;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Configurações "accessmap.*" do application.properties. */
@ConfigurationProperties("accessmap")
public record AccessmapProperties(String frontendDir, Admin admin, Jwt jwt, Cors cors) {

    public record Admin(String usuario, String senha) {}

    public record Jwt(String segredo, int validadeHoras) {}

    public record Cors(List<String> origens) {}

    /** Pasta do front-end como caminho absoluto. */
    public Path pastaFrontend() {
        return Path.of(frontendDir).toAbsolutePath().normalize();
    }
}
