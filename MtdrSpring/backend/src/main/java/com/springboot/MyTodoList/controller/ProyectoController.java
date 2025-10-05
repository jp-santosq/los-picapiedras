package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.service.ProyectoService;


@RestController
@RequestMapping("/proyecto")
public class ProyectoController {
    @Autowired
    private ProyectoService proyectoService;

    @PostMapping("/add")
    public ResponseEntity<Proyecto> addRol(@RequestBody Proyecto newProyecto) {
        Proyecto dbProyecto = proyectoService.addProyecto(newProyecto);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbProyecto.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbProyecto, responseHeaders, HttpStatus.CREATED);
    }

}
