package com.springboot.MyTodoList.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.repository.TareaRepository;

@Service
public class TareaService {
    @Autowired
    private TareaRepository tareaRepository;

    // Servicio para obtener las tareas
    public List<Tarea> getTarea(){
        List<Tarea> tareas = tareaRepository.findAll();
        return tareas;
    }

    // Servicio para añadir tareas
    public Tarea addTarea(Tarea newTarea){
        return tareaRepository.save(newTarea);
    }

    // Servicio para obtener tareas por id de sprint
    public List<Tarea> getTareasBySprintId(Long idSprint){
        return tareaRepository.findBySprint_Id(idSprint);
    }

    // Servicio para obtener tareas por id de usuario
    public List<Tarea> getTareasByDesarrolladorId(Long idDesarrollador){
        return tareaRepository.findByDesarrolladorId(idDesarrollador);
    }
}
