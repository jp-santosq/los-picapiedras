package com.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import com.springboot.MyTodoList.controller.EstadoTareaController;
import com.springboot.MyTodoList.controller.HistoriaUsuarioController;
import com.springboot.MyTodoList.controller.ProyectoController;
import com.springboot.MyTodoList.controller.SprintController;
import com.springboot.MyTodoList.controller.TareaController;
import com.springboot.MyTodoList.controller.UsuarioController;
import com.springboot.MyTodoList.controller.UsuarioProyectoController;
import com.springboot.MyTodoList.dto.HistoriaUsuarioDTO;
import com.springboot.MyTodoList.dto.ProyectoDTO;
import com.springboot.MyTodoList.dto.TareaDTO;
import com.springboot.MyTodoList.dto.UsuarioDTO;
import com.springboot.MyTodoList.dto.UsuarioProyectoDTO;
import com.springboot.MyTodoList.model.EstadoTarea;
import com.springboot.MyTodoList.model.HistoriaUsuario;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.model.Rol;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Tarea;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.repository.EstadoTareaRepository;
import com.springboot.MyTodoList.repository.HistoriaUsuarioRepository;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.TareaRepository;
import com.springboot.MyTodoList.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class TareaControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(TareaControllerTest.class);

    @Mock
    private TareaRepository tareaRepository;

    @Mock
    private EstadoTareaRepository estadoTareaRepository;

    @Mock
    private ProyectoRepository proyectoRepository;

    @Mock
    private SprintRepository sprintRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HistoriaUsuarioRepository historiaUsuarioRepository;

    @Mock
    private com.springboot.MyTodoList.service.EstadoTareaService estadoTareaService;

    @Mock
    private com.springboot.MyTodoList.service.ProyectoService proyectoService;

    @Mock
    private com.springboot.MyTodoList.service.UsuarioProyectoService usuarioProyectoService;

    @Mock
    private com.springboot.MyTodoList.service.SprintService sprintService;

    @Mock
    private com.springboot.MyTodoList.service.UsuarioService usuarioService;

    @InjectMocks
    private TareaController tareaController;

    private TareaDTO dto;
    private EstadoTarea estadoEnProgreso;
    private EstadoTarea estadoCompletado;
    private Proyecto proyecto;
    private Sprint sprint;
    private Usuario desarrollador1;
    private Usuario desarrollador2;
    private HistoriaUsuario historia;

    @BeforeEach
    void setUp() {
        logger.info("=============================================================");
        logger.info("Configurando los datos de prueba...");
        
        // DTO para crear tarea
        dto = new TareaDTO();
        dto.titulo = "Implementar login con JWT";
        dto.descripcion = "Crear la lógica para autenticar usuarios";
        dto.fechaInicio = LocalDate.of(2025, 10, 3);
        dto.fechaFinEstimada = LocalDate.of(2025, 10, 10);
        dto.fechaFinReal = null;
        dto.prioridad = 1;
        dto.estadoTareaId = 4L;
        dto.proyectoId = 4L;
        dto.sprintId = 5L;
        dto.desarrolladorId = 3L;
        dto.historiaUsuarioId = 2L;

        // Estados
        estadoEnProgreso = new EstadoTarea();
        estadoEnProgreso.setId(4L);
        estadoEnProgreso.setNombreEstado("En progreso");

        estadoCompletado = new EstadoTarea();
        estadoCompletado.setId(1L);
        estadoCompletado.setNombreEstado("Completado");

        // Proyecto
        proyecto = new Proyecto();
        proyecto.setId(4L);
        proyecto.setNombreProyecto("Gestor de Tareas");

        // Sprint
        sprint = new Sprint();
        sprint.setId(5L);
        sprint.setFechaInicio(LocalDate.now());
        sprint.setFechaFinEstimada(LocalDate.now().plusDays(14));

        // Desarrolladores
        desarrollador1 = new Usuario();
        desarrollador1.setId(3L);
        desarrollador1.setNombreUsuario("Carlos");

        desarrollador2 = new Usuario();
        desarrollador2.setId(7L);
        desarrollador2.setNombreUsuario("María");

        // Historia de Usuario
        historia = new HistoriaUsuario();
        historia.setId(2L);
        historia.setTitulo("Como usuario quiero iniciar sesión");

        logger.info("Datos de prueba configurados correctamente");
        logger.info("=============================================================");
    }

    // ========================================================================
    // PRUEBA 1: CREAR TAREA (Éxito)
    // ========================================================================
    @Test
    void testAddTarea_Exito() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 1: Crear Tarea - ÉXITO                           │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN
        logger.info("GIVEN: Configurando mocks para crear tarea exitosamente");
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(sprintRepository.findById(dto.sprintId)).thenReturn(Optional.of(sprint));
        when(usuarioRepository.findById(dto.desarrolladorId)).thenReturn(Optional.of(desarrollador1));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));

        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(10L);
            return t;
        });

        // WHEN
        logger.info("WHEN: Ejecutando addTarea()");
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getTitulo()).isEqualTo("Implementar login con JWT");

        verify(tareaRepository, times(1)).save(any(Tarea.class));
        verify(estadoTareaRepository, times(1)).findById(4L);
        verify(proyectoRepository, times(1)).findById(4L);
        verify(historiaUsuarioRepository, times(1)).findById(2L);

        logger.info("✓ Test completado exitosamente");
        logger.info("✓ Tarea creada con ID: {}", result.getId());
        logger.info("=============================================================");
    }

    @Test
    void testAddTarea_EstadoNoExiste() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 2: Crear Tarea - Estado No Existe                │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("EstadoTarea no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("✓ Test completado: Validación de estado inexistente funciona correctamente");
        logger.info("=============================================================");
    }

    @Test
    void testAddTarea_ProyectoNoExiste() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 3: Crear Tarea - Proyecto No Existe              │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("Proyecto no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("✓ Test completado: Validación de proyecto inexistente funciona correctamente");
        logger.info("=============================================================");
    }

    @Test
    void testAddTarea_HistoriaNoExiste() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 4: Crear Tarea - Historia No Existe              │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("HistoriaUsuario no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("✓ Test completado: Validación de historia inexistente funciona correctamente");
        logger.info("=============================================================");
    }

    // ========================================================================
    // PRUEBA 2: VER TAREAS COMPLETADAS DE UN SPRINT
    // ========================================================================
    @Test
    void testGetTareasCompletadasPorSprint_Exito() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 5: Ver Tareas Completadas de un Sprint - ÉXITO   │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: Crear tareas completadas en el sprint
        Tarea tarea1 = crearTareaCompletada(1L, "Tarea 1 Completada", desarrollador1);
        Tarea tarea2 = crearTareaCompletada(2L, "Tarea 2 Completada", desarrollador2);
        Tarea tarea3 = crearTareaCompletada(3L, "Tarea 3 Completada", desarrollador1);

        List<Tarea> tareasCompletadas = Arrays.asList(tarea1, tarea2, tarea3);

        logger.info("GIVEN: Sprint ID = 5 con 3 tareas completadas");
        when(tareaRepository.findTareasCompletadasPorSprint(5L)).thenReturn(tareasCompletadas);

        // WHEN
        logger.info("WHEN: Ejecutando getTareasCompletadasPorSprint(5)");
        ResponseEntity<List<TareaDTO>> response = tareaController.getTareasCompletadasPorSprint(5L);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(3);
        
        TareaDTO primeraTarea = response.getBody().get(0);
        assertThat(primeraTarea.titulo).isEqualTo("Tarea 1 Completada");
        assertThat(primeraTarea.sprintId).isEqualTo(5L);
        assertThat(primeraTarea.estadoTareaId).isEqualTo(1L); // Estado Completado

        verify(tareaRepository, times(1)).findTareasCompletadasPorSprint(5L);

        logger.info("✓ Test completado exitosamente");
        logger.info("✓ Total de tareas completadas encontradas: {}", response.getBody().size());
        logger.info("=============================================================");
    }

    @Test
    void testGetTareasCompletadasPorSprint_SprintSinTareasCompletadas() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 6: Sprint Sin Tareas Completadas                 │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: Sprint sin tareas completadas
        logger.info("GIVEN: Sprint ID = 5 sin tareas completadas");
        when(tareaRepository.findTareasCompletadasPorSprint(5L)).thenReturn(Arrays.asList());

        // WHEN
        logger.info("WHEN: Ejecutando getTareasCompletadasPorSprint(5)");
        ResponseEntity<List<TareaDTO>> response = tareaController.getTareasCompletadasPorSprint(5L);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isEmpty();

        verify(tareaRepository, times(1)).findTareasCompletadasPorSprint(5L);

        logger.info("✓ Test completado: Lista vacía retornada correctamente");
        logger.info("=============================================================");
    }

    // ========================================================================
    // PRUEBA 3: VER TAREAS COMPLETADAS DE UN USUARIO EN UN SPRINT
    // ========================================================================
    @Test
    void testGetTareasCompletadasPorUsuarioEnSprint_Exito() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 7: Tareas Completadas Usuario en Sprint - ÉXITO  │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: Tareas completadas por Carlos en el sprint 5
        Tarea tarea1 = crearTareaCompletada(1L, "Login JWT completado", desarrollador1);
        Tarea tarea2 = crearTareaCompletada(4L, "Validación tokens completada", desarrollador1);

        List<Tarea> tareasCarlos = Arrays.asList(tarea1, tarea2);

        logger.info("GIVEN: Usuario Carlos (ID=3) completó 2 tareas en Sprint 5");
        when(tareaRepository.findTareasCompletadasPorUsuarioEnSprint(5L, 3L)).thenReturn(tareasCarlos);

        // WHEN
        logger.info("WHEN: Ejecutando getTareasCompletadasPorUsuarioEnSprint(5, 3)");
        ResponseEntity<List<TareaDTO>> response = tareaController.getTareasCompletadasPorUsuarioEnSprint(5L, 3L);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(2);

        // Verificar que todas las tareas son del usuario correcto
        response.getBody().forEach(tareaDTO -> {
            assertThat(tareaDTO.desarrolladorId).isEqualTo(3L);
            assertThat(tareaDTO.sprintId).isEqualTo(5L);
            assertThat(tareaDTO.estadoTareaId).isEqualTo(1L); // Completado
        });

        verify(tareaRepository, times(1)).findTareasCompletadasPorUsuarioEnSprint(5L, 3L);

        logger.info("✓ Test completado exitosamente");
        logger.info("✓ Tareas completadas por Carlos: {}", response.getBody().size());
        logger.info("=============================================================");
    }

    @Test
    void testGetTareasCompletadasPorUsuarioEnSprint_UsuarioSinTareasCompletadas() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 8: Usuario Sin Tareas Completadas en Sprint      │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: Usuario María sin tareas completadas
        logger.info("GIVEN: Usuario María (ID=7) sin tareas completadas en Sprint 5");
        when(tareaRepository.findTareasCompletadasPorUsuarioEnSprint(5L, 7L)).thenReturn(Arrays.asList());

        // WHEN
        logger.info("WHEN: Ejecutando getTareasCompletadasPorUsuarioEnSprint(5, 7)");
        ResponseEntity<List<TareaDTO>> response = tareaController.getTareasCompletadasPorUsuarioEnSprint(5L, 7L);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).isEmpty();

        verify(tareaRepository, times(1)).findTareasCompletadasPorUsuarioEnSprint(5L, 7L);

        logger.info("✓ Test completado: Lista vacía retornada correctamente");
        logger.info("=============================================================");
    }

    @Test
    void testGetTareasCompletadasPorUsuarioEnSprint_VariosUsuarios() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 9: Comparar Tareas de Múltiples Usuarios         │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: Carlos tiene 2 tareas, María tiene 1 tarea
        Tarea tareaCarlos1 = crearTareaCompletada(1L, "Tarea Carlos 1", desarrollador1);
        Tarea tareaCarlos2 = crearTareaCompletada(2L, "Tarea Carlos 2", desarrollador1);
        Tarea tareaMaria = crearTareaCompletada(3L, "Tarea María 1", desarrollador2);

        logger.info("GIVEN: Carlos tiene 2 tareas, María tiene 1 tarea completada");
        when(tareaRepository.findTareasCompletadasPorUsuarioEnSprint(5L, 3L))
            .thenReturn(Arrays.asList(tareaCarlos1, tareaCarlos2));
        when(tareaRepository.findTareasCompletadasPorUsuarioEnSprint(5L, 7L))
            .thenReturn(Arrays.asList(tareaMaria));

        // WHEN
        logger.info("WHEN: Consultando tareas de ambos usuarios");
        ResponseEntity<List<TareaDTO>> responseCarlos = tareaController.getTareasCompletadasPorUsuarioEnSprint(5L, 3L);
        ResponseEntity<List<TareaDTO>> responseMaria = tareaController.getTareasCompletadasPorUsuarioEnSprint(5L, 7L);

        // THEN
        logger.info("THEN: Verificando resultados");
        assertThat(responseCarlos.getBody()).hasSize(2);
        assertThat(responseMaria.getBody()).hasSize(1);

        logger.info("✓ Test completado exitosamente");
        logger.info("✓ Tareas de Carlos: {}", responseCarlos.getBody().size());
        logger.info("✓ Tareas de María: {}", responseMaria.getBody().size());
        logger.info("=============================================================");
    }

    // ========================================================================
    // MÉTODO AUXILIAR PARA CREAR TAREAS COMPLETADAS
    // ========================================================================
    private Tarea crearTareaCompletada(Long id, String titulo, Usuario desarrollador) {
        Tarea tarea = new Tarea();
        tarea.setId(id);
        tarea.setTitulo(titulo);
        tarea.setDescripcion("Descripción de " + titulo);
        tarea.setFechaInicio(LocalDate.now().minusDays(7));
        tarea.setFechaFinEstimada(LocalDate.now().minusDays(2));
        tarea.setFechaFinReal(LocalDate.now().minusDays(1));
        tarea.setPrioridad(1);
        tarea.setEstadoTarea(estadoCompletado);
        tarea.setProyecto(proyecto);
        tarea.setSprint(sprint);
        tarea.setDesarrollador(desarrollador);
        tarea.setHistoriaUsuario(historia);
        return tarea;
    }

    //Prueba: crear tarea sin Sprint (null en dto.sprintId)
    @Test
    void testAddTarea_SinSprint() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 10: Crear Tarea - Sin Sprint                     │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // GIVEN: El DTO no tiene sprintId
        dto.sprintId = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(usuarioRepository.findById(dto.desarrolladorId)).thenReturn(Optional.of(desarrollador1));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(11L);
            return t;
        });

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getSprint()).isNull();
        logger.info("✓ Test completado: Tarea creada sin Sprint");
        logger.info("=============================================================");
    }

    //Prueba: crear tarea sin asignar desarrollador ===
    @Test
    void testAddTarea_SinDesarrollador() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 11: Crear Tarea - Sin Desarrollador              │");
        logger.info("└─────────────────────────────────────────────────────────┘");

     // GIVEN: El DTO no tiene desarrolladorId
        dto.desarrolladorId = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(12L);
            return t;
        });

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getDesarrollador()).isNull();
        logger.info("✓ Test completado: Tarea creada sin desarrollador asignado");
        logger.info("=============================================================");
    }

    //Prueba: crear tarea dispara excepción inesperada (simula error en repositorio)
    @Test
    void testAddTarea_ErrorEnRepositorio() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 12: Crear Tarea - Error Desconocido en Guardado  │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        // fuerza un error al guardar
        when(tareaRepository.save(any(Tarea.class))).thenThrow(new RuntimeException("Error de BD"));

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isInstanceOf(String.class);
        assertThat(((String)response.getBody())).contains("Error de BD");
        logger.info("✓ Test completado: Excepción inesperada manejada correctamente");
        logger.info("=============================================================");
    }

    //Prueba: crear tarea con Sprint opcional proporcionado, pero inexistente 
    @Test
    void testAddTarea_SprintInexistente() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 13: Crear Tarea - Sprint Inexistente             │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        // Se simula que el sprintId se proporciona pero NO existe en DB
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(sprintRepository.findById(dto.sprintId)).thenReturn(Optional.empty()); // Sprint no existe
        when(usuarioRepository.findById(dto.desarrolladorId)).thenReturn(Optional.of(desarrollador1));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(13L);
            return t;
        });

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getSprint()).isNull();
        logger.info("✓ Test completado: Si sprintId no existe, la tarea es creada sin sprint");
        logger.info("=============================================================");
    }

    //Prueba: crear tarea con desarrollador opcional proporcionado, pero inexistente 
    @Test
    void testAddTarea_DesarrolladorInexistente() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 14: Crear Tarea - Desarrollador Inexistente      │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(sprintRepository.findById(dto.sprintId)).thenReturn(Optional.of(sprint));
        when(usuarioRepository.findById(dto.desarrolladorId)).thenReturn(Optional.empty()); // Desarrollador no existe
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(14L);
            return t;
        });

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getDesarrollador()).isNull();
        logger.info("✓ Test completado: Si desarrolladorId no existe, la tarea es creada sin desarrollador asignado");
        logger.info("=============================================================");
    }

    //Prueba: crear tarea sin historiaUsuarioId (obligatorio)
    @Test
    void testAddTarea_HistoriaUsuarioIdFaltante() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 15: Crear Tarea - DTO sin historiaUsuarioId       │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.historiaUsuarioId = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isInstanceOf(String.class);
        assertThat(response.getBody().toString()).contains("HistoriaUsuario no existe");
        verify(tareaRepository, never()).save(any());
    }

    //Prueba: crear tarea con prioridad nula (field opcional)
    @Test
    void testAddTarea_PrioridadNula() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 16: Crear Tarea - Prioridad Nula                  │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.prioridad = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(16L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getPrioridad()).isNull(); // Se permite prioridad nula, asume validación a nivel DB si aplica
        logger.info("✓ Test con prioridad nula completado");
    }

    //Prueba: crear tarea con fechaFinReal en el futuro (edge case, no validado)
    @Test
    void testAddTarea_FechaFinRealFutura() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 17: Crear Tarea - FechaFinReal en el futuro       │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.fechaFinReal = LocalDate.now().plusDays(5); // fecha futura
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(17L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getFechaFinReal()).isEqualTo(dto.fechaFinReal);
        logger.info("✓ Test con fechaFinReal futura completado");
    }

    // Prueba: crear tarea con título vacío (posible edge case, se debería permitir)
    @Test
    void testAddTarea_TituloVacio() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 18: Crear Tarea - Título vacío                    │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.titulo = "";
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(18L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getTitulo()).isEmpty();
    }

    //Prueba: crear tarea con descripción nula (campo opcional)
    @Test
    void testAddTarea_DescripcionNula() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 19: Crear Tarea - Descripción Nula                │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.descripcion = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(19L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getDescripcion()).isNull();
    }

    //Prueba: crear tarea con estadoTareaId inexistente (debe devolver 400) 
    @Test
    void testAddTarea_EstadoTareaIdInexistente() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 20: Crear Tarea - EstadoTareaId no existe         │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.empty());
        // Las demás búsquedas no deberían realizarse
        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("EstadoTarea no existe");
        verify(proyectoRepository, never()).findById(any());
        verify(historiaUsuarioRepository, never()).findById(any());
        verify(tareaRepository, never()).save(any());
    }

    //Prueba: crear tarea con proyectoId inexistente (debe devolver 400)
    @Test
    void testAddTarea_ProyectoIdInexistente() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 21: Crear Tarea - ProyectoId no existe            │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.empty());
        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("Proyecto no existe");
        verify(historiaUsuarioRepository, never()).findById(any());
        verify(tareaRepository, never()).save(any());
    }

    //Prueba: crear tarea con fechaInicio después de fechaFinEstimada (no hay validación, pero testea el caso)
    @Test
    void testAddTarea_FechaInicioDespuesDeFinEstimada() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 22: Crear Tarea - fechaInicio > fechaFinEstimada  │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.fechaInicio = LocalDate.of(2025, 12, 1);
        dto.fechaFinEstimada = LocalDate.of(2025, 11, 30); // Un día antes (caso no estándar)
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(22L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getFechaInicio()).isAfter(result.getFechaFinEstimada()); // Debería permitirlo por ahora
    }

    //Prueba: crear tarea con campos mínimos obligatorios (sin opcionales)
    @Test
    void testAddTarea_CamposMinimosObligatorios() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 23: Crear Tarea - Solo obligatorios               │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        dto.sprintId = null;
        dto.desarrolladorId = null;
        dto.descripcion = null;
        dto.fechaFinReal = null;
        dto.prioridad = null;
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoEnProgreso));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(23L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getSprint()).isNull();
        assertThat(result.getDesarrollador()).isNull();
        assertThat(result.getDescripcion()).isNull();
        assertThat(result.getPrioridad()).isNull();
        assertThat(result.getFechaFinReal()).isNull();
    }

    // Prueba: crear tarea con nombre de estadoTarea nulo (el campo existe, aunque no sería común)
    @Test
    void testAddTarea_EstadoNombreNulo() {
        logger.info("");
        logger.info("┌─────────────────────────────────────────────────────────┐");
        logger.info("│  TEST 24: Crear Tarea - EstadoTarea nombre null         │");
        logger.info("└─────────────────────────────────────────────────────────┘");

        EstadoTarea estadoSinNombre = new EstadoTarea();
        estadoSinNombre.setId(5L);
        estadoSinNombre.setNombreEstado(null);

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estadoSinNombre));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(24L);
            return t;
        });

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getEstadoTarea().getNombreEstado()).isNull();
    }

    @Test
    void testHistoriaUsuarioController_CreateProyectoNoEncontrado() {
        HistoriaUsuarioController controller = new HistoriaUsuarioController();
        // Inyectamos mocks a mano (solo para este test)
        ReflectionTestUtils.setField(controller, "repository", historiaUsuarioRepository);
        ReflectionTestUtils.setField(controller, "proyectoRepository", proyectoRepository);

        HistoriaUsuarioDTO dto = new HistoriaUsuarioDTO();
        dto.setProyectoId(999L);
        dto.setTitulo("Nueva HU");
        dto.setDescripcion("desc...");

        when(proyectoRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () -> {
            controller.create(dto);
        });
        assertThat(ex.getMessage()).contains("Proyecto no encontrado");
    }

    // ProyectoController – Agregar proyecto exitosamente
    @Test
    void testProyectoController_AddProyectoExito() {
        ProyectoController controller = new ProyectoController();
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);
        ReflectionTestUtils.setField(controller, "usuarioRepository", usuarioRepository);

        ProyectoDTO dto = new ProyectoDTO();
        dto.setNombreProyecto("Proyecto Nuevo");
        dto.setAdministradorId(123L);

        Usuario admin = new Usuario();
        admin.setId(123L);

        when(usuarioRepository.findById(123L)).thenReturn(Optional.of(admin));

        Proyecto proyecto = new Proyecto();
        proyecto.setId(456L);
        proyecto.setNombreProyecto("Proyecto Nuevo");
        proyecto.setAdministrador(admin);

        when(proyectoService.addProyecto(any(Proyecto.class))).thenReturn(proyecto);

        ResponseEntity<Proyecto> response = controller.addProyecto(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(201);
        assertThat(response.getHeaders().get("location")).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getNombreProyecto()).isEqualTo("Proyecto Nuevo");
        assertThat(response.getBody().getAdministrador().getId()).isEqualTo(123L);
    }

    // EstadoTareaController – Obtener todos los estados de tarea
    @Test
    void testEstadoTareaController_GetTareasDevuelveEstados() {
        EstadoTareaController controller = new EstadoTareaController();
        ReflectionTestUtils.setField(controller, "estadoTareaService", estadoTareaService);

        EstadoTarea e1 = new EstadoTarea(1L, "Pendiente");
        EstadoTarea e2 = new EstadoTarea(2L, "En progreso");

        when(estadoTareaService.findAll()).thenReturn(List.of(e1, e2));

        ResponseEntity<List<EstadoTarea>> response = controller.getTareas();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactly(e1, e2);
    }

    // UsuarioProyectoController – Añadir relación exitosa
    @Test
    void testUsuarioProyectoController_AddUsuarioProyectoExito() {
        UsuarioProyectoController controller = new UsuarioProyectoController();
        ReflectionTestUtils.setField(controller, "usuarioProyectoService", usuarioProyectoService);

        UsuarioProyectoDTO dto = new UsuarioProyectoDTO(4L, 10L, 22L);

        Usuario u = new Usuario(10L);
        Proyecto p = new Proyecto(22L);
        UsuarioProyecto up = new UsuarioProyecto(4L, u, p);

        when(usuarioProyectoService.addProyecto(any(UsuarioProyecto.class))).thenReturn(up);

        ResponseEntity<UsuarioProyectoDTO> response = controller.addUsuarioProyecto(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(4L);
    }

    // SprintController – No existe sprint para update
    @Test
    void testSprintController_UpdateSprintNotFound() {
        SprintController controller = new SprintController();
        ReflectionTestUtils.setField(controller, "sprintService", sprintService);
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);

        when(sprintService.updateSprint(eq(50L), any(Sprint.class))).thenReturn(null);

        ResponseEntity<Sprint> response = controller.updateSprint(50L, new Sprint());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    //UsuarioController – Buscar usuarios por rol retorna vacío
    @Test
    void testUsuarioController_GetUsuarioByRolId_Empty() {
        UsuarioController controller = new UsuarioController();
        ReflectionTestUtils.setField(controller, "usuarioService", usuarioService);

        when(usuarioService.getUsuariosByIdRol(333L)).thenReturn(List.of());

        ResponseEntity<List<UsuarioDTO>> response = controller.getUsuarioByRolId(333L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
    }

    //ProyectoController – getAllProyectos retorna 204 si no hay proyectos
    @Test
    void testProyectoController_GetAllProyectos_NoContent() {
        ProyectoController controller = new ProyectoController();
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);
        ReflectionTestUtils.setField(controller, "usuarioRepository", usuarioRepository);

        when(proyectoService.getAllProyectos()).thenReturn(List.of());

        ResponseEntity<List<Proyecto>> response = controller.getAllProyectos();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    //EstadoTareaController – Intentar actualizar estado inexistente
    @Test
    void testEstadoTareaController_UpdateEstadoTarea_NotFound() {
        EstadoTareaController controller = new EstadoTareaController();
        ReflectionTestUtils.setField(controller, "estadoTareaService", estadoTareaService);

        when(estadoTareaService.updateEstadoTarea(eq(9L), any(EstadoTarea.class))).thenReturn(null);

        ResponseEntity<EstadoTarea> response = controller.updateEstadoTarea(new EstadoTarea(), 9L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    //UsuarioProyectoController – Obtener proyectos por usuario con info completa
    @Test
    void testUsuarioProyectoController_GetProyectosByUsuario_OK() {
        UsuarioProyectoController controller = new UsuarioProyectoController();
        ReflectionTestUtils.setField(controller, "usuarioProyectoService", usuarioProyectoService);

        Usuario usuario = new Usuario(8L);
        usuario.setNombreUsuario("Marina");
        usuario.setCorreo("marina@mail.com");
        usuario.setRol(new Rol(7L, "Dev"));
        Proyecto proyecto = new Proyecto(5L);
        proyecto.setNombreProyecto("Alpha");

        UsuarioProyecto rel = new UsuarioProyecto(44L, usuario, proyecto);
        List<UsuarioProyecto> relaciones = List.of(rel);

        when(usuarioProyectoService.getProyectosByUsuario(8L)).thenReturn(relaciones);

        ResponseEntity<List<UsuarioProyectoDTO>> response = controller.getProyectosByUsuario(8L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        UsuarioProyectoDTO dto = response.getBody().get(0);
        assertThat(dto.getIdProyecto()).isEqualTo(5L);
        assertThat(dto.getUsuario().getNombreUsuario()).isEqualTo("Marina");
    }

    //SprintController – Completar sprint existente 
    @Test
    void testSprintController_CompleteSprint_OK() {
        SprintController controller = new SprintController();
        ReflectionTestUtils.setField(controller, "sprintService", sprintService);
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);

        Sprint sprint = new Sprint();
        sprint.setId(11L);

        when(sprintService.getSprintById(11L)).thenReturn(java.util.Optional.of(sprint));
        when(sprintService.updateSprint(eq(11L), any(Sprint.class))).thenReturn(sprint);

        ResponseEntity<Sprint> response = controller.completeSprint(11L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(11L);
    }

    //UsuarioController – Añadir un usuario exitosamente 
    @Test
    void testUsuarioController_AddUsuario_Exito() throws Exception {
        UsuarioController controller = new UsuarioController();
        ReflectionTestUtils.setField(controller, "usuarioService", usuarioService);

        Usuario usuario = new Usuario();
        usuario.setId(100L);
        usuario.setNombreUsuario("luis");
        usuario.setCorreo("luis@email.com");

        when(usuarioService.addUsuario(any(Usuario.class))).thenReturn(usuario);

        ResponseEntity<Usuario> response = controller.addUsuario(usuario);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().get("location")).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(100L);
    }

    //UsuarioController – Obtener todos los usuarios 
    @Test
    void testUsuarioController_GetAllUsers() {
        UsuarioController controller = new UsuarioController();
        ReflectionTestUtils.setField(controller, "usuarioService", usuarioService);

        Usuario u = new Usuario();
        u.setId(1L);
        u.setNombreUsuario("Ana");
        u.setCorreo("ana@mail.com");
        List<Usuario> usuarios = List.of(u);

        when(usuarioService.findAll()).thenReturn(usuarios);

        List<UsuarioDTO> result = controller.getAllUsers();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNombreUsuario()).isEqualTo("Ana");
    }

    //ProyectoController – Obtener proyectos por administrador 
    @Test
    void testProyectoController_GetProyectosByAdministrador_OK() {
        ProyectoController controller = new ProyectoController();
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);
        ReflectionTestUtils.setField(controller, "usuarioRepository", usuarioRepository);

        Proyecto proy = new Proyecto(7L);
        proy.setNombreProyecto("Demo");
        List<Proyecto> proyectos = List.of(proy);

        when(proyectoService.getProyectosByAdministrador(22L)).thenReturn(proyectos);

        ResponseEntity<List<Proyecto>> response = controller.getProyectosByAdministrador(22L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains(proy);
    }

    //ProyectoController – Obtener proyectos por administrador (vacío) 
    @Test
    void testProyectoController_GetProyectosByAdministrador_Empty() {
        ProyectoController controller = new ProyectoController();
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);
        ReflectionTestUtils.setField(controller, "usuarioRepository", usuarioRepository);

        when(proyectoService.getProyectosByAdministrador(77L)).thenReturn(List.of());

        ResponseEntity<List<Proyecto>> response = controller.getProyectosByAdministrador(77L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    //HistoriaUsuarioController – Get by id no encontrado 
    @Test
    void testHistoriaUsuarioController_GetById_NotFound() {
        HistoriaUsuarioController controller = new HistoriaUsuarioController();
        ReflectionTestUtils.setField(controller, "repository", historiaUsuarioRepository);
        ReflectionTestUtils.setField(controller, "proyectoRepository", proyectoRepository);

        when(historiaUsuarioRepository.findById(555L)).thenReturn(Optional.empty());

        ResponseEntity<HistoriaUsuario> response = controller.getById(555L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // HistoriaUsuarioController – Eliminar historia exitosa 
    @Test
    void testHistoriaUsuarioController_Delete_Exito() {
        HistoriaUsuarioController controller = new HistoriaUsuarioController();
        ReflectionTestUtils.setField(controller, "repository", historiaUsuarioRepository);
        ReflectionTestUtils.setField(controller, "proyectoRepository", proyectoRepository);

        when(historiaUsuarioRepository.existsById(321L)).thenReturn(true);

        ResponseEntity<Void> response = controller.delete(321L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(historiaUsuarioRepository).deleteById(321L);
    }

    //HistoriaUsuarioController – Eliminar historia no existente 
    @Test
    void testHistoriaUsuarioController_Delete_NotFound() {
        HistoriaUsuarioController controller = new HistoriaUsuarioController();
        ReflectionTestUtils.setField(controller, "repository", historiaUsuarioRepository);
        ReflectionTestUtils.setField(controller, "proyectoRepository", proyectoRepository);

        when(historiaUsuarioRepository.existsById(44L)).thenReturn(false);

        ResponseEntity<Void> response = controller.delete(44L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(historiaUsuarioRepository, never()).deleteById(any());
    }

    //EstadoTareaController – Agregar estado tarea exitoso 
    @Test
    void testEstadoTareaController_AddEstadoTarea_OK() {
        EstadoTareaController controller = new EstadoTareaController();
        ReflectionTestUtils.setField(controller, "estadoTareaService", estadoTareaService);

        EstadoTarea e = new EstadoTarea(90L, "Nuevo");
        when(estadoTareaService.addEstadoTarea(any(EstadoTarea.class))).thenReturn(e);

        ResponseEntity<EstadoTarea> response = controller.addEstadoTarea(new EstadoTarea());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(90L);
    }

    //EstadoTareaController – Error interno al agregar estado tarea
    @Test
    void testEstadoTareaController_AddEstadoTarea_Error() {
        EstadoTareaController controller = new EstadoTareaController();
        ReflectionTestUtils.setField(controller, "estadoTareaService", estadoTareaService);

        when(estadoTareaService.addEstadoTarea(any(EstadoTarea.class))).thenThrow(new RuntimeException("DB err"));

        ResponseEntity<EstadoTarea> response = controller.addEstadoTarea(new EstadoTarea());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNull();
    }

    //SprintController – Obtener sprint por id existente 
    @Test
    void testSprintController_GetSprintById_Exito() {
        SprintController controller = new SprintController();
        ReflectionTestUtils.setField(controller, "sprintService", sprintService);
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);

        Sprint sprint = new Sprint();
        sprint.setId(55L);
        when(sprintService.getSprintById(55L)).thenReturn(Optional.of(sprint));

        ResponseEntity<Sprint> response = controller.getSprintById(55L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getId()).isEqualTo(55L);
    }

    //SprintController – Obtener todos los sprints correctamente
    @Test
    void testSprintController_GetAllSprints_OK() {
        SprintController controller = new SprintController();
        ReflectionTestUtils.setField(controller, "sprintService", sprintService);
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);

        Sprint sprint1 = new Sprint();
        sprint1.setId(1L);
        Sprint sprint2 = new Sprint();
        sprint2.setId(2L);
        when(sprintService.getAllSprints()).thenReturn(List.of(sprint1, sprint2));

        ResponseEntity<List<Sprint>> response = controller.getAllSprints();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
    }

    //SprintController – Obtener sprints por proyecto id 
    @Test
    void testSprintController_GetSprintsByProyectoId_OK() {
        SprintController controller = new SprintController();
        ReflectionTestUtils.setField(controller, "sprintService", sprintService);
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);

        Sprint sprint = new Sprint();
        sprint.setId(99L);
        when(sprintService.getSprintsByProyectoId(7L)).thenReturn(List.of(sprint));

        ResponseEntity<List<Sprint>> response = controller.getSprintsByProyectoId(7L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getId()).isEqualTo(99L);
    }

    //ProyectoController – Excepción al agregar proyecto 
    @Test
    void testProyectoController_AddProyectoException() {
        ProyectoController controller = new ProyectoController();
        ReflectionTestUtils.setField(controller, "proyectoService", proyectoService);
        ReflectionTestUtils.setField(controller, "usuarioRepository", usuarioRepository);

        ProyectoDTO dto = new ProyectoDTO();
        dto.setNombreProyecto("Probando error");
        dto.setAdministradorId(42L);
        when(usuarioRepository.findById(42L)).thenReturn(Optional.of(new Usuario()));
        when(proyectoService.addProyecto(any(Proyecto.class))).thenThrow(new RuntimeException("DB down"));

        try {
            controller.addProyecto(dto);
            fail("Se esperaba una excepción");
        } catch (RuntimeException ex) {
            assertThat(ex.getMessage()).contains("DB down");
        }
    }

    //HistoriaUsuarioController – Obtener todas las historias retorna lista
    @Test
    void testHistoriaUsuarioController_GetAll_OK() {
        HistoriaUsuarioController controller = new HistoriaUsuarioController();
        ReflectionTestUtils.setField(controller, "repository", historiaUsuarioRepository);
        ReflectionTestUtils.setField(controller, "proyectoRepository", proyectoRepository);

        HistoriaUsuario hu = new HistoriaUsuario();
        hu.setId(5L);
        when(historiaUsuarioRepository.findAll()).thenReturn(List.of(hu));

        List<HistoriaUsuario> result = controller.getAll();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(5L);
    }

    // === 5. EstadoTareaController – Actualizar estado tarea exitosamente ===
    @Test
    void testEstadoTareaController_UpdateEstadoTarea_OK() {
        EstadoTareaController controller = new EstadoTareaController();
        ReflectionTestUtils.setField(controller, "estadoTareaService", estadoTareaService);

        EstadoTarea et = new EstadoTarea(33L, "Cerrado");
        when(estadoTareaService.updateEstadoTarea(eq(33L), any(EstadoTarea.class))).thenReturn(et);

        ResponseEntity<EstadoTarea> response = controller.updateEstadoTarea(new EstadoTarea(), 33L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNombreEstado()).isEqualTo("Cerrado");
    }

    //UsuarioProyectoController – Obtener usuarios por proyecto vacío
    @Test
    void testUsuarioProyectoController_GetUsuariosByProyecto_Empty() {
        UsuarioProyectoController controller = new UsuarioProyectoController();
        ReflectionTestUtils.setField(controller, "usuarioProyectoService", usuarioProyectoService);

        when(usuarioProyectoService.getUsuariosByProyecto(101L)).thenReturn(List.of());

        ResponseEntity<List<UsuarioProyectoDTO>> response = controller.getUsuariosByProyecto(101L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
    }

}