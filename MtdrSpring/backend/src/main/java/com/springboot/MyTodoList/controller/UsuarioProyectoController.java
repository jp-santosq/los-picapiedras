package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.MyTodoList.dto.UsuarioProyectoDTO;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.service.UsuarioProyectoService;

@RestController
@RequestMapping("/usuarioProyecto")
public class UsuarioProyectoController {

    @Autowired
    private UsuarioProyectoService usuarioProyectoService;

    // Crear una relación usuario-proyecto
    @PostMapping("/add")
    public ResponseEntity<UsuarioProyectoDTO> addUsuarioProyecto(@RequestBody UsuarioProyectoDTO dto) {
        try {
            UsuarioProyecto usuarioProyecto = new UsuarioProyecto();
            usuarioProyecto.setUsuario(new Usuario(dto.getIdUsuario()));
            usuarioProyecto.setProyecto(new Proyecto(dto.getIdProyecto()));

            UsuarioProyecto dbUsuarioProyecto = usuarioProyectoService.addProyecto(usuarioProyecto);

            UsuarioProyectoDTO responseDTO = new UsuarioProyectoDTO(
                    dbUsuarioProyecto.getId(),
                    dbUsuarioProyecto.getUsuario().getId(),
                    dbUsuarioProyecto.getProyecto().getId()
            );

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Obtener todos los usuarios de un proyecto con información completa
    @GetMapping("/proyecto/{idProyecto}")
    public ResponseEntity<List<UsuarioProyectoDTO>> getUsuariosByProyecto(@PathVariable Long idProyecto) {
        try {
            List<UsuarioProyecto> relaciones = usuarioProyectoService.getUsuariosByProyecto(idProyecto);
            
            List<UsuarioProyectoDTO> response = relaciones.stream()
                .map(rel -> {
                    Usuario usuario = rel.getUsuario();
                    Proyecto proyecto = rel.getProyecto();
                    
                    UsuarioProyectoDTO.RolInfo rolInfo = new UsuarioProyectoDTO.RolInfo(
                        usuario.getRol().getId()
                    );
                    
                    UsuarioProyectoDTO.UsuarioInfo usuarioInfo = new UsuarioProyectoDTO.UsuarioInfo(
                        usuario.getId(),
                        usuario.getNombreUsuario(),
                        usuario.getCorreo(),
                        rolInfo
                    );
                    
                    UsuarioProyectoDTO.ProyectoInfo proyectoInfo = new UsuarioProyectoDTO.ProyectoInfo(
                        proyecto.getId(),
                        proyecto.getNombreProyecto()
                    );
                    
                    return new UsuarioProyectoDTO(rel.getId(), usuarioInfo, proyectoInfo);
                })
                .collect(Collectors.toList());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}