package com.services;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.controller.TareaController;
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
}