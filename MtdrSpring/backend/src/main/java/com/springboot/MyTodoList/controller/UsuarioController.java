package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.dto.UsuarioDTO;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.service.UsuarioService;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping("/usuarios")
    public List<UsuarioDTO> getAllUsers() {
        return usuarioService.findAll()
                            .stream()
                            .map(UsuarioDTO::fromEntity)
                            .collect(Collectors.toList());
    }

    // Añadir un usuario
    @PostMapping("/addusuario")
    public ResponseEntity<Usuario> addUsuario(@RequestBody Usuario newUsuario) throws Exception {
        Usuario dbUsuario = usuarioService.addUsuario(newUsuario);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location", "" + dbUsuario.getId());
        responseHeaders.set("Access-Control-Expose-Headers", "location");
        return new ResponseEntity<>(dbUsuario, responseHeaders, HttpStatus.CREATED);
    }

    // Obtener usuarios por tipo de rol
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<List<UsuarioDTO>> getUsuarioByRolId(@PathVariable Long idRol){
        List<UsuarioDTO> usuariosDTO = usuarioService.getUsuariosByIdRol(idRol)
                                                    .stream()
                                                    .map(UsuarioDTO::fromEntity)
                                                    .collect(Collectors.toList());
        return new ResponseEntity<>(usuariosDTO, HttpStatus.OK);
    }

}
