package com.services;

import java.time.LocalDate;
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
    private EstadoTarea estado;
    private Proyecto proyecto;
    private Sprint sprint;
    private Usuario desarrollador;
    private HistoriaUsuario historia;

    @BeforeEach
    void setUp() {
        logger.info("Configurando los datos de prueba...");
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

        estado = new EstadoTarea();
        estado.setId(4L);
        estado.setNombreEstado("En progreso");

        proyecto = new Proyecto();
        proyecto.setId(4L);
        proyecto.setNombreProyecto("Gestor de Tareas");

        sprint = new Sprint();
        sprint.setId(5L);
        sprint.setFechaInicio(LocalDate.now());
        sprint.setFechaFinEstimada(LocalDate.now().plusDays(14));

        desarrollador = new Usuario();
        desarrollador.setId(3L);
        desarrollador.setNombreUsuario("Carlos");

        historia = new HistoriaUsuario();
        historia.setId(2L);
        historia.setTitulo("Como usuario quiero iniciar sesión");

        logger.info("Datos de prueba configurados correctamente ");
    }

    @Test
    void testAddTarea_Exito() {
        logger.info("Ejecutando testAddTarea_Exito...");

        // GIVEN
        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estado));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(sprintRepository.findById(dto.sprintId)).thenReturn(Optional.of(sprint));
        when(usuarioRepository.findById(dto.desarrolladorId)).thenReturn(Optional.of(desarrollador));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.of(historia));

        // Simular el save de Tarea
        when(tareaRepository.save(any(Tarea.class))).thenAnswer(i -> {
            Tarea t = i.getArgument(0);
            t.setId(10L); // asignar ID simulado
            return t;
        });

        // WHEN
        ResponseEntity<?> response = tareaController.addTarea(dto);

        // THEN
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        Tarea result = (Tarea) response.getBody();
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getTitulo()).isEqualTo("Implementar login con JWT");

        verify(tareaRepository, times(1)).save(any(Tarea.class));
        verify(estadoTareaRepository, times(1)).findById(4L);
        verify(proyectoRepository, times(1)).findById(4L);
        verify(historiaUsuarioRepository, times(1)).findById(2L);

        logger.info("testAddTarea_Exito pasó correctamente ");
    }

    @Test
    void testAddTarea_EstadoNoExiste() {
        logger.info("Ejecutando testAddTarea_EstadoNoExiste...");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("EstadoTarea no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("testAddTarea_EstadoNoExiste pasó correctamente ");
    }

    @Test
    void testAddTarea_ProyectoNoExiste() {
        logger.info("Ejecutando testAddTarea_ProyectoNoExiste...");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estado));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("Proyecto no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("testAddTarea_ProyectoNoExiste pasó correctamente ");
    }

    @Test
    void testAddTarea_HistoriaNoExiste() {
        logger.info("Ejecutando testAddTarea_HistoriaNoExiste...");

        when(estadoTareaRepository.findById(dto.estadoTareaId)).thenReturn(Optional.of(estado));
        when(proyectoRepository.findById(dto.proyectoId)).thenReturn(Optional.of(proyecto));
        when(historiaUsuarioRepository.findById(dto.historiaUsuarioId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = tareaController.addTarea(dto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo("HistoriaUsuario no existe");

        verify(tareaRepository, never()).save(any());

        logger.info("testAddTarea_HistoriaNoExiste pasó correctamente ");
    }
}
