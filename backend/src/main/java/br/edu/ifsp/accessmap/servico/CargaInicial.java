package br.edu.ifsp.accessmap.servico;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ifsp.accessmap.config.AccessmapProperties;
import br.edu.ifsp.accessmap.dominio.Administrador;
import br.edu.ifsp.accessmap.dominio.Espaco;
import br.edu.ifsp.accessmap.repositorio.AdministradorRepositorio;

/**
 * A cada inicialização: cria a conta de administrador (se não houver
 * nenhuma), sincroniza os pacotes de espaços (espacos/<slug>/espaco.json)
 * e cadastra a lista original de locais dos espaços que ainda não têm locais.
 */
@Component
public class CargaInicial implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CargaInicial.class);

    private final AdministradorRepositorio administradores;
    private final EspacoServico espacoServico;
    private final PontoServico pontoServico;
    private final PasswordEncoder passwordEncoder;
    private final AccessmapProperties props;

    public CargaInicial(AdministradorRepositorio administradores, EspacoServico espacoServico,
                        PontoServico pontoServico, PasswordEncoder passwordEncoder, AccessmapProperties props) {
        this.administradores = administradores;
        this.espacoServico = espacoServico;
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
        List<Espaco> espacos = espacoServico.sincronizarPacotes();
        log.info("{} espaço(s) sincronizado(s): {}", espacos.size(),
                espacos.stream().map(Espaco::getSlug).toList());
        for (Espaco espaco : espacos) {
            if (pontoServico.contar(espaco) == 0) {
                int total = pontoServico.importarOriginais(espaco);
                log.info("{}: {} locais originais cadastrados no banco.", espaco.getSlug(), total);
            }
        }
    }
}
