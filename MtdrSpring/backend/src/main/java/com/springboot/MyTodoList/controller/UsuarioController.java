package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.service.UsuarioService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping(value="/usuarios")
    public List<Usuario> getAllUsers(){
        return usuarioService.findAll();
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
    public ResponseEntity<List<Usuario>> getUsuarioByRolId(@PathVariable Long idRol){
        List<Usuario> usuarios = usuarioService.getUsuariosByIdRol(idRol);
        return new ResponseEntity<>(usuarios,HttpStatus.OK);
    }

}
