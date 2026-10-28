package br.edu.ifsp.accessmap.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifsp.accessmap.dominio.Administrador;

public interface AdministradorRepositorio extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByNomeUsuario(String nomeUsuario);
}
