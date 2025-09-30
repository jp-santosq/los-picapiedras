package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.service.UsuarioService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@CrossOrigin(origins = "*") 
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping(value = "/usuarios")
    public ResponseEntity<List<Usuario>> getAllUsers() {
        List<Usuario> usuarios = usuarioService.findAll();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Obtener usuario por id 
    @GetMapping(value = "/usuarios/{id}")
    public ResponseEntity<Usuario> getUserById(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.getUsuarioById(id);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Añadir usuario
    @PostMapping(value = "/addusuario")
    public ResponseEntity<?> addUsuario(@RequestBody Usuario newUsuario) {
        try {
            Usuario dbUsuario = usuarioService.addUsuario(newUsuario);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.set("location", "/usuario/usuarios/" + dbUsuario.getId());
            responseHeaders.set("Access-Control-Expose-Headers", "location");
            return new ResponseEntity<>(dbUsuario, responseHeaders, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Actualizar usuario completo
    @PutMapping(value = "/usuarios/{id}")
    public ResponseEntity<?> updateUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuarioActualizado) {
        try {
            Usuario usuario = usuarioService.updateUsuario(id, usuarioActualizado);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        }
    }

    // Actualizar parcialmente usuario
    @PatchMapping(value = "/usuarios/{id}")
    public ResponseEntity<?> patchUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuarioActualizado) {
        try {
            Usuario usuario = usuarioService.updateUsuario(id, usuarioActualizado);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        }
    }

    // Eliminar usuario
    @DeleteMapping(value = "/usuarios/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return new ResponseEntity<>(
                Map.of("message", "Usuario eliminado exitosamente"), 
                HttpStatus.OK
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        }
    }


    // Obtener usuario por correo
    @GetMapping(value = "/correo/{correo}")
    public ResponseEntity<Usuario> getUserByCorreo(@PathVariable String correo) {
        try {
            Usuario usuario = usuarioService.getUsuarioByCorreo(correo);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Verificar si existe un correo
    @GetMapping(value = "/exists/correo/{correo}")
    public ResponseEntity<Map<String, Boolean>> existsByCorreo(@PathVariable String correo) {
        boolean exists = usuarioService.existsByCorreo(correo);
        return new ResponseEntity<>(
            Map.of("exists", exists), 
            HttpStatus.OK
        );
    }

    // Buscar usuarios por nombre de usuario (búsqueda parcial)
    @GetMapping(value = "/search/nombre")
    public ResponseEntity<List<Usuario>> findByNombreUsuario(
            @RequestParam String nombreUsuario) {
        List<Usuario> usuarios = usuarioService.findByNombreUsuario(nombreUsuario);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Obtener usuarios por modalidad
    @GetMapping(value = "/modalidad/{modalidad}")
    public ResponseEntity<List<Usuario>> findByModalidad(@PathVariable String modalidad) {
        List<Usuario> usuarios = usuarioService.findByModalidad(modalidad);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Obtener usuarios por rol (ID)
    @GetMapping(value = "/rol/{rolId}")
    public ResponseEntity<List<Usuario>> findByRolId(@PathVariable Long rolId) {
        List<Usuario> usuarios = usuarioService.findByRolId(rolId);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Obtener usuarios por nombre de rol
    @GetMapping(value = "/rol/nombre/{nombreRol}")
    public ResponseEntity<List<Usuario>> findByRolNombre(@PathVariable String nombreRol) {
        List<Usuario> usuarios = usuarioService.findByRolNombre(nombreRol);
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }


    // Búsqueda con múltiples criterios opcionales
    @GetMapping(value = "/search")
    public ResponseEntity<List<Usuario>> searchUsuarios(
            @RequestParam(required = false) String nombreUsuario,
            @RequestParam(required = false) String correo,
            @RequestParam(required = false) String modalidad,
            @RequestParam(required = false) Long rolId) {
        List<Usuario> usuarios = usuarioService.searchUsuarios(
            nombreUsuario, correo, modalidad, rolId
        );
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }


    // Actualizar solo la contraseña
    @PatchMapping(value = "/usuarios/{id}/contrasena")
    public ResponseEntity<?> updateContrasena(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String nuevaContrasena = body.get("contrasena");
            if (nuevaContrasena == null || nuevaContrasena.isEmpty()) {
                return new ResponseEntity<>(
                    Map.of("error", "La contraseña no puede estar vacía"), 
                    HttpStatus.BAD_REQUEST
                );
            }
            Usuario usuario = usuarioService.updateContrasena(id, nuevaContrasena);
            return new ResponseEntity<>(
                Map.of("message", "Contraseña actualizada exitosamente"), 
                HttpStatus.OK
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                Map.of("error", e.getMessage()), 
                HttpStatus.NOT_FOUND
            );
        }
    }
}