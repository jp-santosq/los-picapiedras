package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.dto.AuthRequestDTO;
import com.springboot.MyTodoList.dto.AuthResponseDTO;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import com.springboot.MyTodoList.service.AuthenticationService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authenticationService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}