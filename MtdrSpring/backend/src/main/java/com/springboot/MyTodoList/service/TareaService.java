package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Tarea> updateTarea(Long id, Tarea updated) {
        return tareaRepository.findById(id).map(tarea -> {
            tarea.setDescripcion(updated.getDescripcion());
            tarea.setFechaInicio(updated.getFechaInicio());
            tarea.setFechaFinEstimada(updated.getFechaFinEstimada());
            tarea.setFechaFinReal(updated.getFechaFinReal());
            return tareaRepository.save(tarea);
        });
    }

    public Optional<Tarea> getTareaById(Long id){
        return tareaRepository.findById(id);
    }

    public List<Tarea> getTareasByDesarrollador(Long idDesarrollador){
        return tareaRepository.findByDesarrolladorId(idDesarrollador);
    }

   
}
