package com.springboot.MyTodoList.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.service.UsuarioProyectoService;

import java.util.List;

@RestController
@RequestMapping("/usuarioProyecto")
public class UsuarioProyectoController {

    @Autowired
    private UsuarioProyectoService usuarioProyectoService;

    // Crear una relación usuario-proyecto
    @PostMapping("/add")
    public ResponseEntity<UsuarioProyecto> addUsuarioProyecto(@RequestBody UsuarioProyecto newUsuarioProyecto) {
        try {
            UsuarioProyecto dbUsuarioProyecto = usuarioProyectoService.addProyecto(newUsuarioProyecto);
            return new ResponseEntity<>(dbUsuarioProyecto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener todas las relaciones usuario-proyecto
    @GetMapping("/all")
    public ResponseEntity<List<UsuarioProyecto>> getAllUsuarioProyectos() {
        try {
            List<UsuarioProyecto> relaciones = usuarioProyectoService.getAllRelaciones();
            if (relaciones.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(relaciones, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener una relación por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioProyecto> getUsuarioProyectoById(@PathVariable Long id) {
        try {
            UsuarioProyecto relacion = usuarioProyectoService.getRelacionById(id);
            if (relacion != null) {
                return new ResponseEntity<>(relacion, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener todos los proyectos de un usuario específico
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<UsuarioProyecto>> getProyectosByUsuario(@PathVariable Long idUsuario) {
        try {
            List<UsuarioProyecto> proyectos = usuarioProyectoService.getProyectosByUsuario(idUsuario);
            if (proyectos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(proyectos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener todos los usuarios de un proyecto específico
    @GetMapping("/proyecto/{idProyecto}")
    public ResponseEntity<List<UsuarioProyecto>> getUsuariosByProyecto(@PathVariable Long idProyecto) {
        try {
            List<UsuarioProyecto> usuarios = usuarioProyectoService.getUsuariosByProyecto(idProyecto);
            if (usuarios.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Verificar si existe una relación específica usuario-proyecto
    @GetMapping("/existe")
    public ResponseEntity<Boolean> existeRelacion(
            @RequestParam Long idUsuario, 
            @RequestParam Long idProyecto) {
        try {
            boolean existe = usuarioProyectoService.existeRelacion(idUsuario, idProyecto);
            return new ResponseEntity<>(existe, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar una relación usuario-proyecto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUsuarioProyecto(@PathVariable Long id) {
        try {
            boolean deleted = usuarioProyectoService.deleteRelacion(id);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar una relación específica por usuario y proyecto
    @DeleteMapping("/remove")
    public ResponseEntity<HttpStatus> removeUsuarioFromProyecto(
            @RequestParam Long idUsuario, 
            @RequestParam Long idProyecto) {
        try {
            boolean deleted = usuarioProyectoService.deleteByUsuarioAndProyecto(idUsuario, idProyecto);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar todas las relaciones de un usuario
    @DeleteMapping("/usuario/{idUsuario}")
    public ResponseEntity<HttpStatus> deleteAllProyectosByUsuario(@PathVariable Long idUsuario) {
        try {
            usuarioProyectoService.deleteAllByUsuario(idUsuario);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar todas las relaciones de un proyecto
    @DeleteMapping("/proyecto/{idProyecto}")
    public ResponseEntity<HttpStatus> deleteAllUsuariosByProyecto(@PathVariable Long idProyecto) {
        try {
            usuarioProyectoService.deleteAllByProyecto(idProyecto);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Contar cuántos usuarios tiene un proyecto
    @GetMapping("/proyecto/{idProyecto}/count")
    public ResponseEntity<Long> countUsuariosByProyecto(@PathVariable Long idProyecto) {
        try {
            long count = usuarioProyectoService.countUsuariosByProyecto(idProyecto);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Contar cuántos proyectos tiene un usuario
    @GetMapping("/usuario/{idUsuario}/count")
    public ResponseEntity<Long> countProyectosByUsuario(@PathVariable Long idUsuario) {
        try {
            long count = usuarioProyectoService.countProyectosByUsuario(idUsuario);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}