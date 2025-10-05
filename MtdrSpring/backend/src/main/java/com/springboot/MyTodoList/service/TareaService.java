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

    public List<Tarea> getTarea(){
        List<Tarea> tareas = tareaRepository.findAll();
        return tareas;
    }
    public Tarea addTarea(Tarea newTarea){
        return tareaRepository.save(newTarea);
    }
}
