package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.service.TareaService;
import com.springboot.MyTodoList.model.Tarea;


@RestController
@RequestMapping("/tarea")
public class TareaController {
    @Autowired
    private TareaService tareaService;


    // Añadir una tarea
    @PostMapping("/add")
    public ResponseEntity<Tarea> addRol(@RequestBody Tarea newTarea) {
        Tarea dbTarea = tareaService.addTarea(newTarea);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbTarea.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbTarea, responseHeaders, HttpStatus.CREATED);
    }

    // Actualizar campos básicos de la tarea
    @PutMapping("/update/{id}")
    public ResponseEntity<Tarea> updateTarea(@PathVariable Long id, @RequestBody Tarea updated) {
        Optional<Tarea> dbTarea = tareaService.updateTarea(id, updated);
        return dbTarea.map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Ver estado de una tarea
    @GetMapping("/{id}/estado")
    public ResponseEntity<String> getEstadoTarea(@PathVariable Long id) {
        Optional<Tarea> tarea = tareaService.getTareaById(id);
        
        if (tarea.isPresent()) {
            Tarea t = tarea.get();
            if (t.getEstado() != null) {
                return new ResponseEntity<>(t.getEstado().getNombreEstado(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Sin estado asignado", HttpStatus.OK);
            }
        }
        
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    // Ver todas las tareas de un desarrollador
    @GetMapping("/desarrollador/{idDesarrollador}")
    public ResponseEntity<List<Tarea>> getTareasByDesarrollador(@PathVariable Long idDesarrollador) {
        List<Tarea> tareas = tareaService.getTareasByDesarrollador(idDesarrollador);
        return new ResponseEntity<>(tareas, HttpStatus.OK);
    }


}