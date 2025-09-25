package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;

@RestController
@RequestMapping("/sprint")
public class SprintController {
    @Autowired
    private SprintService sprintService;


    // Metodo para añadir proyecto
    @PostMapping("/add")
    public ResponseEntity<Sprint> addRol(@RequestBody Sprint newSprint) {
        Sprint dbSprint = sprintService.addSprint(newSprint);

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbSprint.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");

        return new ResponseEntity<>(dbSprint, responseHeaders, HttpStatus.CREATED);
    }
}
