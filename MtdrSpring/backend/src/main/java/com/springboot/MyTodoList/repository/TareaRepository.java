package com.springboot.MyTodoList.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.Tarea;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface TareaRepository extends JpaRepository<Tarea,Long> {
    List<Tarea> findBySprint_Id(Long idSprint);
    List<Tarea> findByDesarrolladorId(Long idDesarrollador);
    
    // Obtener tareas completadas de un sprint
    @Query("SELECT t FROM Tarea t WHERE t.sprint.id = :sprintId AND t.estadoTarea.nombreEstado = 'Completado'")
    List<Tarea> findTareasCompletadasPorSprint(@Param("sprintId") Long sprintId);
    
    // Obtener tareas completadas de un usuario en un sprint específico
    @Query("SELECT t FROM Tarea t WHERE t.sprint.id = :sprintId AND t.desarrollador.id = :usuarioId AND t.estadoTarea.nombreEstado = 'Completado'")
    List<Tarea> findTareasCompletadasPorUsuarioEnSprint(@Param("sprintId") Long sprintId, @Param("usuarioId") Long usuarioId);
}