package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.dto.SprintDTO;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.ProyectoService;
import com.springboot.MyTodoList.model.Proyecto;


@RestController
@RequestMapping("/sprint")
public class SprintController {
    @Autowired
    private SprintService sprintService;

    @Autowired
    private ProyectoService proyectoService;

    // Metodo para añadir proyecto
    @PostMapping("/add")
    public ResponseEntity<Sprint> addSprint(@RequestBody SprintDTO sprintDTO) {
        Proyecto proyecto = proyectoService.getProyectoById(sprintDTO.getProyectoId())
            .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Sprint sprint = new Sprint();
        sprint.setFechaInicio(sprintDTO.getFechaInicio());
        sprint.setFechaFinEstimada(sprintDTO.getFechaFinEstimada());
        sprint.setFechaFinReal(sprintDTO.getFechaFinReal());
        sprint.setProyecto(proyecto);

        Sprint dbSprint = sprintService.addSprint(sprint);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbSprint.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbSprint, responseHeaders, HttpStatus.CREATED);
    }

    // Obtener todos los sprints
    @GetMapping("/all")
    public ResponseEntity<List<Sprint>> getAllSprints() {
        List<Sprint> sprints = sprintService.getAllSprints();
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    // Obtener sprints por Id
    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable Long id) {
        Optional<Sprint> sprint = sprintService.getSprintById(id);
        
        if (sprint.isPresent()) {
            return new ResponseEntity<>(sprint.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Obtener sprints por proyecto
    @GetMapping("/proyecto/{idProyecto}")
    public ResponseEntity<List<Sprint>> getSprintsByProyectoId(@PathVariable Long idProyecto) {
        List<Sprint> sprints = sprintService.getSprintsByProyectoId(idProyecto);
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }

    // Actulizar sprint por id
    @PutMapping("/update/{id}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable Long id, @RequestBody Sprint sprintActualizado) {
        Sprint sprint = sprintService.updateSprint(id, sprintActualizado);
        
        if (sprint != null) {
            return new ResponseEntity<>(sprint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar sprint por id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        boolean eliminado = sprintService.deleteSprint(id);
        
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Completar sprint (establecer fecha de fin real)
    @PutMapping("/{id}/complete")
    public ResponseEntity<Sprint> completeSprint(@PathVariable Long id) {
        Optional<Sprint> sprintOpt = sprintService.getSprintById(id);
        
        if (sprintOpt.isPresent()) {
            Sprint sprint = sprintOpt.get();
            sprint.setFechaFinReal(java.time.LocalDate.now());
            Sprint updatedSprint = sprintService.updateSprint(id, sprint);
            return new ResponseEntity<>(updatedSprint, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
