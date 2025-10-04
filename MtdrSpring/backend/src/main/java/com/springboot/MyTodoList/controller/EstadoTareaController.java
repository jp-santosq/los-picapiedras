package com.springboot.MyTodoList.controller;

import java.util.List;

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

import com.springboot.MyTodoList.model.EstadoTarea;
import com.springboot.MyTodoList.service.EstadoTareaService;

@RestController
@RequestMapping("/estadoTarea")
public class EstadoTareaController {

    @Autowired
    private EstadoTareaService estadoTareaService;

    //Metodo para obtener los estados de las tareas
    @GetMapping("/estados")
    public ResponseEntity<List<EstadoTarea>> getTareas() {
        List<EstadoTarea> estados = estadoTareaService.findAll();
        return ResponseEntity.ok(estados);
    }
    // Metodo para agregar estados de tarea
    @PostMapping("/add")
    public ResponseEntity<EstadoTarea> addEstadoTarea(@RequestBody EstadoTarea newEstadoTarea) {
        try {
            EstadoTarea dbEstadoTarea = estadoTareaService.addEstadoTarea(newEstadoTarea);
            
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.set("location", "" + dbEstadoTarea.getId());
            responseHeaders.set("Access-Control-Expose-Headers", "location");
            
            return new ResponseEntity<>(dbEstadoTarea, responseHeaders, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Método existente
    @PutMapping("/update/{id}")
    public ResponseEntity<EstadoTarea> updateEstadoTarea(@RequestBody EstadoTarea estadoTarea, @PathVariable Long id) {
        try {
            EstadoTarea dbTarea = estadoTareaService.updateEstadoTarea(id, estadoTarea);
            if (dbTarea != null) {
                return new ResponseEntity<>(dbTarea, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}