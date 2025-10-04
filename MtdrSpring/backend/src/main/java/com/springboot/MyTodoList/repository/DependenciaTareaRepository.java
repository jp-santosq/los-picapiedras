package com.springboot.MyTodoList.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.springboot.MyTodoList.model.DependenciaTarea;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import jakarta.transaction.Transactional;


@Transactional
@EnableTransactionManagement
@Repository
public interface DependenciaTareaRepository extends JpaRepository<DependenciaTarea, Long> {
}