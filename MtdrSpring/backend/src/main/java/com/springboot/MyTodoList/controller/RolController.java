package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.Rol;
import com.springboot.MyTodoList.service.RolService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/rol")
public class RolController {

    @Autowired
    private RolService rolService;

    //Método para agregar un rol
    @PostMapping("/add")
    public ResponseEntity<Rol> addRol(@RequestBody Rol newRol) {
        Rol dbRol = rolService.addRol(newRol);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbRol.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbRol, responseHeaders, HttpStatus.CREATED);
    }

    //Metodo para mostrar todos los roles
    @GetMapping("/roles")
    public List<Rol> getAllUsers(){
        return rolService.findAll();
    }
}
