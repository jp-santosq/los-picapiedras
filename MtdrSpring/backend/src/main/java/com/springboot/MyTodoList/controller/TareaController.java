package com.springboot.MyTodoList.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
import com.springboot.MyTodoList.service.SprintPlanningService;

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

    @Autowired
    private SprintPlanningService sprintPlanningService;

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

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/plan-sprint", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> sugerirTareasParaSprint(@RequestParam("archivo") MultipartFile archivoTxt) {
        if (archivoTxt == null || archivoTxt.isEmpty()) {
            return ResponseEntity.badRequest().body("Debes adjuntar un archivo .txt con la descripción del sprint.");
        }

        String nombreArchivo = archivoTxt.getOriginalFilename();
        if (StringUtils.hasText(nombreArchivo) && !nombreArchivo.toLowerCase().endsWith(".txt")) {
            return ResponseEntity.badRequest().body("Solo se aceptan archivos con extensión .txt.");
        }

        try {
            String descripcion = new String(archivoTxt.getBytes(), StandardCharsets.UTF_8);
            if (!StringUtils.hasText(descripcion)) {
                return ResponseEntity.badRequest().body("El archivo está vacío, agrega la descripción del sprint.");
            }

            List<TareaDTO> tareas = sprintPlanningService.generarTareas(descripcion);
            return ResponseEntity.ok(tareas);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("No se pudo leer el archivo proporcionado.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
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

    // Actualizar tarea completa
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTarea(@PathVariable Long id, @RequestBody TareaDTO dto) {
        try {
            Tarea tarea = tareaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + id));

            // Actualizar campos básicos
            tarea.setTitulo(dto.titulo);
            tarea.setDescripcion(dto.descripcion);
            tarea.setFechaInicio(dto.fechaInicio);
            tarea.setFechaFinEstimada(dto.fechaFinEstimada);
            tarea.setFechaFinReal(dto.fechaFinReal);
            tarea.setPrioridad(dto.prioridad);

            // Actualizar EstadoTarea (obligatorio)
            if (dto.estadoTareaId != null) {
                EstadoTarea estado = estadoTareaRepository.findById(dto.estadoTareaId)
                        .orElseThrow(() -> new RuntimeException("EstadoTarea no existe con id: " + dto.estadoTareaId));
                tarea.setEstadoTarea(estado);
            }

            // Actualizar Proyecto (obligatorio)
            if (dto.proyectoId != null) {
                Proyecto proyecto = proyectoRepository.findById(dto.proyectoId)
                        .orElseThrow(() -> new RuntimeException("Proyecto no existe con id: " + dto.proyectoId));
                tarea.setProyecto(proyecto);
            }

            // Actualizar Sprint (opcional)
            if (dto.sprintId != null) {
                Sprint sprint = sprintRepository.findById(dto.sprintId)
                        .orElseThrow(() -> new RuntimeException("Sprint no existe con id: " + dto.sprintId));
                tarea.setSprint(sprint);
            } else {
                tarea.setSprint(null);
            }

            // Actualizar Desarrollador (opcional)
            if (dto.desarrolladorId != null) {
                Usuario usuario = usuarioRepository.findById(dto.desarrolladorId)
                        .orElseThrow(() -> new RuntimeException("Usuario no existe con id: " + dto.desarrolladorId));
                tarea.setDesarrollador(usuario);
            } else {
                tarea.setDesarrollador(null);
            }

            // Actualizar HistoriaUsuario (obligatorio)
            if (dto.historiaUsuarioId != null) {
                HistoriaUsuario historia = historiaUsuarioRepository.findById(dto.historiaUsuarioId)
                        .orElseThrow(() -> new RuntimeException("HistoriaUsuario no existe con id: " + dto.historiaUsuarioId));
                tarea.setHistoriaUsuario(historia);
            }

            // Guardar y retornar
            Tarea tareaActualizada = tareaRepository.save(tarea);
            
            // Crear DTO de respuesta
            TareaDTO responseDto = new TareaDTO();
            responseDto.id = tareaActualizada.getId();
            responseDto.titulo = tareaActualizada.getTitulo();
            responseDto.descripcion = tareaActualizada.getDescripcion();
            responseDto.fechaInicio = tareaActualizada.getFechaInicio();
            responseDto.fechaFinEstimada = tareaActualizada.getFechaFinEstimada();
            responseDto.fechaFinReal = tareaActualizada.getFechaFinReal();
            responseDto.prioridad = tareaActualizada.getPrioridad();
            responseDto.estadoTareaId = tareaActualizada.getEstadoTarea() != null ? tareaActualizada.getEstadoTarea().getId() : null;
            responseDto.proyectoId = tareaActualizada.getProyecto() != null ? tareaActualizada.getProyecto().getId() : null;
            responseDto.sprintId = tareaActualizada.getSprint() != null ? tareaActualizada.getSprint().getId() : null;
            responseDto.desarrolladorId = tareaActualizada.getDesarrollador() != null ? tareaActualizada.getDesarrollador().getId() : null;
            responseDto.historiaUsuarioId = tareaActualizada.getHistoriaUsuario() != null ? tareaActualizada.getHistoriaUsuario().getId() : null;

            return ResponseEntity.ok(responseDto);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar tarea: " + e.getMessage());
        }
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

    @GetMapping("/sprint/{sprintId}/completadas")
    public ResponseEntity<List<TareaDTO>> getTareasCompletadasPorSprint(@PathVariable Long sprintId) {
        try {
            List<Tarea> tareas = tareaRepository.findTareasCompletadasPorSprint(sprintId);
            
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
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener tareas completadas de un usuario en un sprint específico
     * GET /tarea/sprint/{sprintId}/usuario/{usuarioId}/completadas
     */
    @GetMapping("/sprint/{sprintId}/usuario/{usuarioId}/completadas")
    public ResponseEntity<List<TareaDTO>> getTareasCompletadasPorUsuarioEnSprint(
            @PathVariable Long sprintId, 
            @PathVariable Long usuarioId) {
        try {
            List<Tarea> tareas = tareaRepository.findTareasCompletadasPorUsuarioEnSprint(sprintId, usuarioId);
            
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
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
