package com.springboot.MyTodoList.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.EstadoTarea;
import com.springboot.MyTodoList.repository.EstadoTareaRepository;

@Service
public class EstadoTareaService {

    @Autowired
    private EstadoTareaRepository estadoTareaRepository;

    // Metodo para crear estado para una tarea
    public EstadoTarea addEstadoTarea(EstadoTarea newEstadoTarea) {
        return estadoTareaRepository.save(newEstadoTarea);
    }

    // Método metodo para cambiar el estado de una tarea
    public EstadoTarea updateEstadoTarea(Long id, EstadoTarea tarea2update) {
        Optional<EstadoTarea> dbTarea = estadoTareaRepository.findById(id);
        if (dbTarea.isPresent()) {
            EstadoTarea tarea = dbTarea.get();
            tarea.setNombreEstado(tarea2update.getNombreEstado()); // solo se actualiza el nombre
            return estadoTareaRepository.save(tarea);
        } else {
            return null;
        }
    }
}