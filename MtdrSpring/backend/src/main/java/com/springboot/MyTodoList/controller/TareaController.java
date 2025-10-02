package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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

    @PostMapping("/add")
    public ResponseEntity<Tarea> addRol(@RequestBody Tarea newTarea) {
        Tarea dbTarea = tareaService.addTarea(newTarea);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbTarea.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbTarea, responseHeaders, HttpStatus.CREATED);
    }
}
