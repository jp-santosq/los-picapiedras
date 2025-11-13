package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.ProyectoRepository;

@Service
public class ProyectoService {
    @Autowired
    private ProyectoRepository proyectoRepository;

    public Proyecto addProyecto(Proyecto newProyecto){
        return proyectoRepository.save(newProyecto);
    }

    public Optional<Proyecto> getProyectoById(Long id) {
        return proyectoRepository.findById(id);
    }

    public List<Proyecto> getAllProyectos(){
        return proyectoRepository.findAll();
    }


    public List<Proyecto> getProyectosByAdministrador(Long idAdministrador) {
        return proyectoRepository.findByAdministradorId(idAdministrador);
    }
}
