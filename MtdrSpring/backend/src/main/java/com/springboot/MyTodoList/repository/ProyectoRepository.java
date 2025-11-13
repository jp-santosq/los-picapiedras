package com.springboot.MyTodoList.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.Proyecto;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ProyectoRepository extends JpaRepository<Proyecto,Long> {

    @Query("SELECT p FROM Proyecto p WHERE p.administrador.id = :idAdministrador")
    List<Proyecto> findByAdministradorId(@Param("idAdministrador") Long idAdministrador);
}