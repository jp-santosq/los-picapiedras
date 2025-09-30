package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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


    // Crear proyecto
    @PostMapping("/add")
    public ResponseEntity<Proyecto> addProyecto(@RequestBody Proyecto newProyecto) {
        Proyecto dbProyecto = proyectoService.addProyecto(newProyecto);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbProyecto.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbProyecto, responseHeaders, HttpStatus.CREATED);
    }

    // Mostrar todos los proyectos
    @GetMapping("/proyectos")
    public ResponseEntity<List<Proyecto>> getAllProyectos() {
        List<Proyecto> proyectos = proyectoService.findAll();

        if (proyectos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }


    // Mostrar todos los proyectos de un administrador por su ID
    @GetMapping("/administrador/{idAdministrador}")
    public ResponseEntity<List<Proyecto>> getProyectosByAdministrador(@PathVariable Long idAdministrador) {
        List<Proyecto> proyectos = proyectoService.findByAdministradorId(idAdministrador);

        if (proyectos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }


    

}
