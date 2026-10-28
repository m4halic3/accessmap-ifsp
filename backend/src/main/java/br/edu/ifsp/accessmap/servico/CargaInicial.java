package br.edu.ifsp.accessmap.servico;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.accessmap.config.AccessmapProperties;
import br.edu.ifsp.accessmap.dominio.Administrador;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;
import br.edu.ifsp.accessmap.repositorio.PontoRepositorio;

/**
 * Na primeira execução (banco vazio), cria a conta de administrador e
 * cadastra os locais originais do mapa. Nas seguintes, não faz nada.
 */
@Component
public class CargaInicial implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CargaInicial.class);

    private final AdministradorRepositorio administradores;
    private final PontoRepositorio pontos;
    private final PontoServico pontoServico;
    private final PasswordEncoder passwordEncoder;
    private final AccessmapProperties props;

    public CargaInicial(AdministradorRepositorio administradores, PontoRepositorio pontos,
                        PontoServico pontoServico, PasswordEncoder passwordEncoder, AccessmapProperties props) {
        this.administradores = administradores;
        this.pontos = pontos;
        this.pontoServico = pontoServico;
        this.passwordEncoder = passwordEncoder;
        this.props = props;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (administradores.count() == 0) {
            String usuario = props.admin().usuario();
            administradores.save(new Administrador(usuario,
                    passwordEncoder.encode(props.admin().senha()), "superadmin"));
            log.info("Administrador \"{}\" criado.", usuario);
        }
        if (pontos.count() == 0) {
            int total = pontoServico.importarOriginais();
            log.info("{} locais originais cadastrados no banco.", total);
        }
    }
}
