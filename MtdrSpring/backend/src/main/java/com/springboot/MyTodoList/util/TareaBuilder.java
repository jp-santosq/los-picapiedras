package com.springboot.MyTodoList.util;

import com.springboot.MyTodoList.model.*;
import java.time.LocalDate;

/**
 * Constructor progresivo de tareas durante la conversación
 * 
 * Esta clase acumula los datos de la tarea conforme el usuario
 * los va proporcionando paso a paso.
 * 
 * Ejemplo de uso:
 * TareaBuilder builder = new TareaBuilder();
 * builder.setTitulo("Login");
 * builder.setDescripcion("Sistema de autenticación");
 * builder.setFechaInicio(LocalDate.now());
 * // ... más datos
 * Tarea tarea = builder.build(); // Crea la tarea completa
 */
public class TareaBuilder {
    private String titulo;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private Integer prioridad;
    private Long desarrolladorId;
    private Long proyectoId;
    // Historia de usuario se manejará por defecto

    public TareaBuilder() {}

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public void setPrioridad(Integer prioridad) {
        this.prioridad = prioridad;
    }

    public void setDesarrolladorId(Long desarrolladorId) {
        this.desarrolladorId = desarrolladorId;
    }

    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }

    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaFinEstimada() { return fechaFinEstimada; }
    public Integer getPrioridad() { return prioridad; }
    public Long getDesarrolladorId() { return desarrolladorId; }
    public Long getProyectoId() { return proyectoId; }

    /**
     * Construye la tarea final con todos los datos recopilados
     */
    public Tarea build() {
        Tarea tarea = new Tarea();
        tarea.setTitulo(titulo);
        tarea.setDescripcion(descripcion);
        tarea.setFechaInicio(fechaInicio);
        tarea.setFechaFinEstimada(fechaFinEstimada);
        tarea.setPrioridad(prioridad);

        // Estado inicial: Pendiente
        EstadoTarea estado = new EstadoTarea();
        estado.setId(1L);
        tarea.setEstadoTarea(estado);

        // Proyecto
        Proyecto proyecto = new Proyecto();
        proyecto.setId(proyectoId);
        tarea.setProyecto(proyecto);

        // Historia de usuario por defecto (ID 1)
        HistoriaUsuario historia = new HistoriaUsuario();
        historia.setId(1L);
        tarea.setHistoriaUsuario(historia);

        // Desarrollador
        Usuario desarrollador = new Usuario();
        desarrollador.setId(desarrolladorId);
        tarea.setDesarrollador(desarrollador);

        return tarea;
    }

    public void reset() {
        titulo = null;
        descripcion = null;
        fechaInicio = null;
        fechaFinEstimada = null;
        prioridad = null;
        desarrolladorId = null;
        proyectoId = null;
    }

    /**
     * Genera resumen de los datos actuales
     */
    public String getSummary() {
        return "📋 *Resumen de la tarea:*\n" +
               "• Título: " + titulo + "\n" +
               "• Descripción: " + descripcion + "\n" +
               "• Fecha inicio: " + fechaInicio + "\n" +
               "• Fecha fin estimada: " + fechaFinEstimada + "\n" +
               "• Prioridad: " + prioridad + "\n" +
               "• Desarrollador ID: " + desarrolladorId + "\n" +
               "• Proyecto ID: " + proyectoId + "\n" +
               "• Historia Usuario ID: 1 (por defecto)";
    }
}