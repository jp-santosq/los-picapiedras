package com.springboot.MyTodoList.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.EstadoTarea;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface EstadoTareaRepository extends JpaRepository<EstadoTarea,Long> {


}
