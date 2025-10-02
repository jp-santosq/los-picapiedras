package com.springboot.MyTodoList.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.repository.TareaRepository;
import com.springboot.MyTodoList.model.Tarea;

@Service
public class TareaService {
    @Autowired
    private TareaRepository tareaRepository;

    public Tarea addTarea(Tarea newTarea){
        return tareaRepository.save(newTarea);
    }
}
