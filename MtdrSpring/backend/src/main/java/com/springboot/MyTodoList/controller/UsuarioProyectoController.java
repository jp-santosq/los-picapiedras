package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.service.UsuarioProyectoService;

@RestController
@RequestMapping("/usuarioProyecto")
public class UsuarioProyectoController {

    @Autowired
    private UsuarioProyectoService usuarioProyectoService;

    // Crear una relación usuario-proyecto
    @PostMapping("/add")
    public ResponseEntity<UsuarioProyecto> addUsuarioProyecto(@RequestBody UsuarioProyecto newUsuarioProyecto) {
        try {
            UsuarioProyecto dbUsuarioProyecto = usuarioProyectoService.addProyecto(newUsuarioProyecto);
            return new ResponseEntity<>(dbUsuarioProyecto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
