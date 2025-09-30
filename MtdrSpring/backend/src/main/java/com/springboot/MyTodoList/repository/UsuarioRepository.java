package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por correo
    Optional<Usuario> findByCorreo(String correo);
    
    // Verificar si existe un correo
    boolean existsByCorreo(String correo);
    
    // Buscar usuarios por nombre de usuario (contiene)
    List<Usuario> findByNombreUsuarioContainingIgnoreCase(String nombreUsuario);
    
    // Buscar usuarios por modalidad
    List<Usuario> findByModalidad(String modalidad);
    
    // Buscar usuarios por rol
    List<Usuario> findByRolId(Long rolId);
    
    // Buscar usuarios por nombre de rol
    @Query("SELECT u FROM Usuario u WHERE u.rol.nombreRol = :nombreRol")
    List<Usuario> findByRolNombre(@Param("nombreRol") String nombreRol);
    
    // Query personalizada para buscar por múltiples criterios
    @Query("SELECT u FROM Usuario u WHERE " +
           "(:nombreUsuario IS NULL OR LOWER(u.nombreUsuario) LIKE LOWER(CONCAT('%', :nombreUsuario, '%'))) AND " +
           "(:correo IS NULL OR LOWER(u.correo) LIKE LOWER(CONCAT('%', :correo, '%'))) AND " +
           "(:modalidad IS NULL OR u.modalidad = :modalidad) AND " +
           "(:rolId IS NULL OR u.rol.id = :rolId)")
    List<Usuario> findByMultipleCriteria(
        @Param("nombreUsuario") String nombreUsuario,
        @Param("correo") String correo,
        @Param("modalidad") String modalidad,
        @Param("rolId") Long rolId
    );
}