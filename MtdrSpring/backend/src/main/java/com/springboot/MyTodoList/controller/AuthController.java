package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.dto.AuthRequestDTO;
import com.springboot.MyTodoList.dto.AuthResponseDTO;
import com.springboot.MyTodoList.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authenticationService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
