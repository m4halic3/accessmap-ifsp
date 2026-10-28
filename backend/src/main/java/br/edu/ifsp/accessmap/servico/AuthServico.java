package br.edu.ifsp.accessmap.servico;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.accessmap.config.AccessmapProperties;
import br.edu.ifsp.accessmap.dominio.Administrador;
import br.edu.ifsp.accessmap.dto.LoginResposta;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;

@Service
public class AuthServico {

    private final AdministradorRepositorio administradores;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final AccessmapProperties props;
    // Hash de uma senha qualquer, conferido quando o usuário não existe: assim a
    // resposta demora o mesmo tempo e não revela quais usuários estão cadastrados
    private final String hashFalso;

    public AuthServico(AdministradorRepositorio administradores, PasswordEncoder passwordEncoder,
                       JwtEncoder jwtEncoder, AccessmapProperties props) {
        this.administradores = administradores;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.props = props;
        this.hashFalso = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    @Transactional
    public LoginResposta login(String usuario, String senha) {
        Administrador admin = administradores.findByNomeUsuario(usuario.trim()).orElse(null);
        boolean senhaConfere = passwordEncoder.matches(senha, admin != null ? admin.getSenhaHash() : hashFalso);

        if (admin == null || !senhaConfere || !admin.isAtivo()) {
            throw new RegraNegocioException(HttpStatus.UNAUTHORIZED,
                    "Usuário ou senha incorretos. Confira e tente novamente.");
        }

        admin.setUltimoLogin(LocalDateTime.now());

        Instant agora = Instant.now();
        Instant expira = agora.plus(props.jwt().validadeHoras(), ChronoUnit.HOURS);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("accessmap")
                .subject(admin.getNomeUsuario())
                .claim("adm", admin.getId())
                .claim("perfil", admin.getPerfil())
                .issuedAt(agora)
                .expiresAt(expira)
                .build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();

        return new LoginResposta(token, expira, admin.getNomeUsuario());
    }
}
