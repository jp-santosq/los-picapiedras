package com.springboot.MyTodoList.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.UsuarioProyecto;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UsuarioProyectoRepository extends JpaRepository<UsuarioProyecto,Long> {
    
    @Query("SELECT up FROM UsuarioProyecto up WHERE up.proyecto.id = :idProyecto")
    List<UsuarioProyecto> findByProyectoId(@Param("idProyecto") Long idProyecto);

    @Query("SELECT up FROM UsuarioProyecto up WHERE up.usuario.id = :idUsuario")
    List<UsuarioProyecto> findByUsuarioId(@Param("idUsuario") Long idUsuario);
}
