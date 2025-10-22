package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.dto.TareaDTO;
import com.springboot.MyTodoList.model.EstadoTarea;
import com.springboot.MyTodoList.model.HistoriaUsuario;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.repository.EstadoTareaRepository;
import com.springboot.MyTodoList.repository.HistoriaUsuarioRepository;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.TareaRepository;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import com.springboot.MyTodoList.service.TareaService;

@RestController
@RequestMapping("/tarea")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private TareaService tareaService;

    @Autowired
    private EstadoTareaRepository estadoTareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistoriaUsuarioRepository historiaUsuarioRepository;

    // Obtener todas las tareas
    @GetMapping
    public ResponseEntity<List<TareaDTO>> getAll() {
        List<Tarea> tareas = tareaRepository.findAll();
        List<TareaDTO> tareasDTO = tareas.stream()
            .map(tarea -> {
                TareaDTO dto = new TareaDTO();
                dto.id = tarea.getId();
                dto.titulo = tarea.getTitulo();
                dto.descripcion = tarea.getDescripcion();
                dto.fechaInicio = tarea.getFechaInicio();
                dto.fechaFinEstimada = tarea.getFechaFinEstimada();
                dto.fechaFinReal = tarea.getFechaFinReal();
                dto.prioridad = tarea.getPrioridad();
                dto.estadoTareaId = tarea.getEstadoTarea() != null ? tarea.getEstadoTarea().getId() : null;
                dto.proyectoId = tarea.getProyecto() != null ? tarea.getProyecto().getId() : null;
                dto.sprintId = tarea.getSprint() != null ? tarea.getSprint().getId() : null;
                dto.desarrolladorId = tarea.getDesarrollador() != null ? tarea.getDesarrollador().getId() : null;
                dto.historiaUsuarioId = tarea.getHistoriaUsuario() != null ? tarea.getHistoriaUsuario().getId() : null;
                return dto;
            })
            .collect(Collectors.toList());
    
        return new ResponseEntity<>(tareasDTO, HttpStatus.OK);
    }

    // Obtener tarea por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tarea> getById(@PathVariable Long id) {
        return tareaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear tarea con validación de IDs
    @PostMapping
    public ResponseEntity<?> addTarea(@RequestBody TareaDTO dto) {
        try {
            Tarea tarea = new Tarea();
            tarea.setTitulo(dto.titulo);
            tarea.setDescripcion(dto.descripcion);
            tarea.setFechaInicio(dto.fechaInicio);
            tarea.setFechaFinEstimada(dto.fechaFinEstimada);
            tarea.setFechaFinReal(dto.fechaFinReal);
            tarea.setPrioridad(dto.prioridad);

            // Validar EstadoTarea
            EstadoTarea estado = estadoTareaRepository.findById(dto.estadoTareaId)
                    .orElseThrow(() -> new RuntimeException("EstadoTarea no existe"));
            tarea.setEstadoTarea(estado);

            // Validar Proyecto
            Proyecto proyecto = proyectoRepository.findById(dto.proyectoId)
                    .orElseThrow(() -> new RuntimeException("Proyecto no existe"));
            tarea.setProyecto(proyecto);

            // Validar HistoriaUsuario (obligatorio)
            HistoriaUsuario historia = historiaUsuarioRepository.findById(dto.historiaUsuarioId)
                    .orElseThrow(() -> new RuntimeException("HistoriaUsuario no existe"));
            tarea.setHistoriaUsuario(historia);

            // Sprint opcional
            if (dto.sprintId != null) {
                Sprint sprint = sprintRepository.findById(dto.sprintId).orElse(null);
                tarea.setSprint(sprint);
            }

            // Desarrollador opcional
            if (dto.desarrolladorId != null) {
                Usuario usuario = usuarioRepository.findById(dto.desarrolladorId).orElse(null);
                tarea.setDesarrollador(usuario);
            }

            Tarea saved = tareaRepository.save(tarea);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar tarea
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTarea(@PathVariable Long id, @RequestBody TareaDTO dto) {
        return tareaRepository.findById(id)
                .map(t -> {
                    t.setTitulo(dto.titulo);
                    t.setDescripcion(dto.descripcion);
                    t.setFechaInicio(dto.fechaInicio);
                    t.setFechaFinEstimada(dto.fechaFinEstimada);
                    t.setFechaFinReal(dto.fechaFinReal);
                    t.setPrioridad(dto.prioridad);

                    estadoTareaRepository.findById(dto.estadoTareaId)
                            .ifPresent(t::setEstadoTarea);

                    proyectoRepository.findById(dto.proyectoId)
                            .ifPresent(t::setProyecto);

                    if (dto.sprintId != null) {
                        sprintRepository.findById(dto.sprintId).ifPresent(t::setSprint);
                    } else {
                        t.setSprint(null);
                    }

                    if (dto.desarrolladorId != null) {
                        usuarioRepository.findById(dto.desarrolladorId).ifPresent(t::setDesarrollador);
                    } else {
                        t.setDesarrollador(null);
                    }

                    if (dto.historiaUsuarioId != null) {
                        historiaUsuarioRepository.findById(dto.historiaUsuarioId)
                                .ifPresent(t::setHistoriaUsuario);
                    }

                    return ResponseEntity.ok(tareaRepository.save(t));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar Tarea
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTarea(@PathVariable Long id) {
        try {
            if (!tareaRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tarea con id " + id + " no encontrada");
            }
        
            tareaRepository.deleteById(id);
            return ResponseEntity.ok("Tarea eliminada exitosamente");
        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar tarea: " + e.getMessage());
        }
    }

    // Obtener tareas por id de sprint
    @GetMapping("/sprint/{id}")
    public ResponseEntity<List<TareaDTO>> getTareasBySprintId(@PathVariable Long id){
        List<Tarea> tareas = tareaService.getTareasBySprintId(id);
        List<TareaDTO> tareasDTO = tareas.stream()
            .map(tarea -> {
                TareaDTO dto = new TareaDTO();
                dto.titulo = tarea.getTitulo();
                dto.descripcion = tarea.getDescripcion();
                dto.fechaInicio = tarea.getFechaInicio();
                dto.fechaFinEstimada = tarea.getFechaFinEstimada();
                dto.fechaFinReal = tarea.getFechaFinReal();
                dto.prioridad = tarea.getPrioridad();
                dto.estadoTareaId = tarea.getEstadoTarea() != null ? tarea.getEstadoTarea().getId() : null;
                dto.proyectoId = tarea.getProyecto() != null ? tarea.getProyecto().getId() : null;
                dto.sprintId = tarea.getSprint() != null ? tarea.getSprint().getId() : null;
                dto.desarrolladorId = tarea.getDesarrollador() != null ? tarea.getDesarrollador().getId() : null;
                dto.historiaUsuarioId = tarea.getHistoriaUsuario() != null ? tarea.getHistoriaUsuario().getId() : null;
                return dto;
            })
            .collect(Collectors.toList());
        
        return new ResponseEntity<>(tareasDTO, HttpStatus.OK);
    }

    // Obtener tareas por id de usuario
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<TareaDTO>> getTareasByDesarrolladorId(@PathVariable Long id){
        List<Tarea> tareas = tareaService.getTareasByDesarrolladorId(id);
        List<TareaDTO> tareasDTO = tareas.stream()
            .map(tarea -> {
                TareaDTO dto = new TareaDTO();
                dto.titulo = tarea.getTitulo();
                dto.descripcion = tarea.getDescripcion();
                dto.fechaInicio = tarea.getFechaInicio();
                dto.fechaFinEstimada = tarea.getFechaFinEstimada();
                dto.fechaFinReal = tarea.getFechaFinReal();
                dto.prioridad = tarea.getPrioridad();
                dto.estadoTareaId = tarea.getEstadoTarea() != null ? tarea.getEstadoTarea().getId() : null;
                dto.proyectoId = tarea.getProyecto() != null ? tarea.getProyecto().getId() : null;
                dto.sprintId = tarea.getSprint() != null ? tarea.getSprint().getId() : null;
                dto.desarrolladorId = tarea.getDesarrollador() != null ? tarea.getDesarrollador().getId() : null;
                dto.historiaUsuarioId = tarea.getHistoriaUsuario() != null ? tarea.getHistoriaUsuario().getId() : null;
                return dto;
            })
            .collect(Collectors.toList());
        
        return new ResponseEntity<>(tareasDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}/estado/{estadoId}")
    public ResponseEntity<?> cambiarEstadoTarea(
            @PathVariable Long id, 
            @PathVariable Long estadoId) {
        try {
        // Buscar la tarea
            Tarea tarea = tareaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tarea con id " + id + " no encontrada"));
        
            // Buscar el nuevo estado
            EstadoTarea nuevoEstado = estadoTareaRepository.findById(estadoId)
                    .orElseThrow(() -> new RuntimeException("EstadoTarea con id " + estadoId + " no existe"));
        
            // Cambiar el estado
            tarea.setEstadoTarea(nuevoEstado);
        
            // Guardar y retornar
            Tarea tareaActualizada = tareaRepository.save(tarea);
            return ResponseEntity.ok(tareaActualizada);
        
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar el estado: " + e.getMessage());
        }
    }
}
