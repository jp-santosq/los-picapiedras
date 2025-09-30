package com.springboot.MyTodoList.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.ProyectoRepository;

@Service
public class ProyectoService {
    @Autowired
    private ProyectoRepository proyectoRepository;

    // Metodo para añadir proyecto
    public Proyecto addProyecto(Proyecto newProyecto){
        return proyectoRepository.save(newProyecto);
    }

    // Metodo para mostrar todos los proyectos
    public List<Proyecto> findAll(){
        return proyectoRepository.findAll();
    }

    // Metodo para encontrar proyecto por ID de administrador
    public List<Proyecto> findByAdministradorId(Long idAdministrador){
    return proyectoRepository.findByAdministradorId(idAdministrador);
}

}
