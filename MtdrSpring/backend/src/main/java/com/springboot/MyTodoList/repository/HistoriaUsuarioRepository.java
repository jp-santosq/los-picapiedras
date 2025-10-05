package com.springboot.MyTodoList.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.springboot.MyTodoList.model.HistoriaUsuario;

import jakarta.transaction.Transactional;


@Transactional
@EnableTransactionManagement
@Repository
public interface HistoriaUsuarioRepository extends JpaRepository<HistoriaUsuario, Long> {
}