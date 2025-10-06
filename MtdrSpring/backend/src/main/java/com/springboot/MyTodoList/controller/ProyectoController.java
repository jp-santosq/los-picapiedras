package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.dto.ProyectoDTO;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.repository.UsuarioRepository;

import com.springboot.MyTodoList.service.ProyectoService;


@RestController
@RequestMapping("/proyecto")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    @Autowired
    private UsuarioRepository usuarioRepository; // <--- aquí

    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Proyecto> addProyecto(@RequestBody ProyectoDTO proyectoDTO) {

        // Buscar usuario en DB
        Usuario admin = usuarioRepository.findById(proyectoDTO.getAdministradorId())
                                         .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = new Proyecto();
        proyecto.setNombreProyecto(proyectoDTO.getNombreProyecto());
        proyecto.setAdministrador(admin);

        Proyecto dbProyecto = proyectoService.addProyecto(proyecto);

        HttpHeaders headers = new HttpHeaders();
        headers.set("location", "" + dbProyecto.getId());
        headers.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbProyecto, headers, HttpStatus.CREATED);
    }
}
