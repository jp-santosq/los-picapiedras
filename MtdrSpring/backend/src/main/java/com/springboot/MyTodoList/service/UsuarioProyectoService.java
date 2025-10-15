package com.springboot.MyTodoList.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.repository.UsuarioProyectoRepository;

@Service
public class UsuarioProyectoService {

    @Autowired
    private UsuarioProyectoRepository usuarioProyectoRepository;

    // Crear una relación usuario-proyecto
    public UsuarioProyecto addProyecto(UsuarioProyecto newProyecto){
        return usuarioProyectoRepository.save(newProyecto);
    }


    //  Nuevo método para obtener usuarios por proyecto
    public List<UsuarioProyecto> getUsuariosByProyecto(Long idProyecto) {
        return usuarioProyectoRepository.findByProyectoId(idProyecto);
    }
}
