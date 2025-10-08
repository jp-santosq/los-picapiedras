package com.springboot.MyTodoList.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.Sprint;

import jakarta.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface SprintRepository extends JpaRepository<Sprint,Long> {
    List<Sprint> findByProyectoId(Long idProyecto);
}
