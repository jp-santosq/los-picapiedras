package com.springboot.MyTodoList.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
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
}
