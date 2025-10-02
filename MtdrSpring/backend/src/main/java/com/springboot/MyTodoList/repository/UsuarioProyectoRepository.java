package com.springboot.MyTodoList.repository;


import com.springboot.MyTodoList.model.UsuarioProyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;

@Repository
@Transactional
@EnableTransactionManagement
public interface UsuarioProyectoRepository extends JpaRepository<UsuarioProyecto,Long> {


}
