package com.springboot.MyTodoList.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;

@Service
public class SprintService {
    @Autowired
    private SprintRepository sprintRepository;

    // Metodo para añadir sprint
    public Sprint addSprint(Sprint newSprint){
        return sprintRepository.save(newSprint);
    } 

    // Metodo para obtener todos los sprints de un proyecto
    public List<Sprint> getSprintsByProyecto(Long idProyecto){
        return sprintRepository.findByProyectoId(idProyecto);
    }
    

    //Metodo para obtener todas las tareas de un sprint
    public List<Tarea> getTareasBySprint(Long idSprint){
        Sprint sprint = sprintRepository.findById(idSprint).orElse(null);
        if(sprint != null){
            return sprint.getTareas();
        }
        return List.of(); 
    }

}
