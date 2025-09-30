package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.UsuarioProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UsuarioProyectoRepository extends JpaRepository<UsuarioProyecto, Long> {

    // Encontrar todas las relaciones de un usuario específico
    List<UsuarioProyecto> findByUsuarioId(Long idUsuario);

    // Encontrar todas las relaciones de un proyecto específico
    List<UsuarioProyecto> findByProyectoId(Long idProyecto);

    // Verificar si existe una relación específica usuario-proyecto
    boolean existsByUsuarioIdAndProyectoId(Long idUsuario, Long idProyecto);

    // Encontrar una relación específica por usuario y proyecto
    Optional<UsuarioProyecto> findByUsuarioIdAndProyectoId(Long idUsuario, Long idProyecto);

    // Eliminar todas las relaciones de un usuario
    void deleteByUsuarioId(Long idUsuario);

    // Eliminar todas las relaciones de un proyecto
    void deleteByProyectoId(Long idProyecto);

    // Contar cuántos usuarios tiene un proyecto
    long countByProyectoId(Long idProyecto);

    // Contar cuántos proyectos tiene un usuario
    long countByUsuarioId(Long idUsuario);
}