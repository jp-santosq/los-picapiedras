package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;

@Service
public class SprintService {
    @Autowired
    private SprintRepository sprintRepository;

    // Añadir un sprint
    public Sprint addSprint(Sprint newSprint){
        return sprintRepository.save(newSprint);
    }

    // Obtener todos los sprints
    public List<Sprint> getAllSprints() {
        return sprintRepository.findAll();
    }

    // Obtener los sprint por Id
    public Optional<Sprint> getSprintById(Long id) {
        return sprintRepository.findById(id);
    }
    
    // Obtener sprints por id de proyecto
    public List<Sprint> getSprintsByProyectoId(Long idProyecto) {
        return sprintRepository.findByProyectoId(idProyecto);
    }

    // Eliminar un sprint
    public boolean deleteSprint(Long id) {
        if (sprintRepository.existsById(id)) {
            sprintRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Actualizar un sprint
    public Sprint updateSprint(Long id, Sprint sprintActualizado) {
        Optional<Sprint> sprintExistente = sprintRepository.findById(id);
        
        if (sprintExistente.isPresent()) {
            Sprint sprint = sprintExistente.get();
            
            // Actualizar campos
            if (sprintActualizado.getFechaInicio() != null) {
                sprint.setFechaInicio(sprintActualizado.getFechaInicio());
            }
            if (sprintActualizado.getFechaFinEstimada() != null) {
                sprint.setFechaFinEstimada(sprintActualizado.getFechaFinEstimada());
            }
            if (sprintActualizado.getFechaFinReal() != null) {
                sprint.setFechaFinReal(sprintActualizado.getFechaFinReal());
            }
            if (sprintActualizado.getProyecto() != null) {
                sprint.setProyecto(sprintActualizado.getProyecto());
            }
            
            return sprintRepository.save(sprint);
        }
        
        return null;
    }
}
