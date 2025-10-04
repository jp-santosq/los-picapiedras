package com.springboot.MyTodoList.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tarea")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Long id;

    @Column(length = 100)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin_estimada", nullable = false)
    private LocalDate fechaFinEstimada;

    @Column(name = "fecha_fin_real")
    private LocalDate fechaFinReal;

    @Column
    private Integer prioridad;

    @ManyToOne
    @JoinColumn(name = "id_estado_tarea", nullable = false)
    private EstadoTarea estadoTarea;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "id_sprint")
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "id_desarrollador")
    private Usuario desarrollador;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "id_historia_usuario", nullable = false)
    private HistoriaUsuario historiaUsuario;

    // Constructor sin argumentos
    public Tarea() {
    }

    // Constructor con todos los campos
    public Tarea(Long id, String titulo, String descripcion, LocalDate fechaInicio,
                 LocalDate fechaFinEstimada, LocalDate fechaFinReal, Integer prioridad,
                 EstadoTarea estadoTarea, Proyecto proyecto, Sprint sprint,
                 Usuario desarrollador) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFinEstimada = fechaFinEstimada;
        this.fechaFinReal = fechaFinReal;
        this.prioridad = prioridad;
        this.estadoTarea = estadoTarea;
        this.proyecto = proyecto;
        this.sprint = sprint;
        this.desarrollador = desarrollador;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFinEstimada() {
        return fechaFinEstimada;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public LocalDate getFechaFinReal() {
        return fechaFinReal;
    }

    public void setFechaFinReal(LocalDate fechaFinReal) {
        this.fechaFinReal = fechaFinReal;
    }

    public Integer getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Integer prioridad) {
        this.prioridad = prioridad;
    }

    public EstadoTarea getEstadoTarea() {
        return estadoTarea;
    }

    public void setEstadoTarea(EstadoTarea estadoTarea) {
        this.estadoTarea = estadoTarea;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Usuario getDesarrollador() {
        return desarrollador;
    }

    public void setDesarrollador(Usuario desarrollador) {
        this.desarrollador = desarrollador;
    }

    public HistoriaUsuario getHistoriaUsuario() {
        return historiaUsuario;
    }

    public void setHistoriaUsuario(HistoriaUsuario historiaUsuario) {
        this.historiaUsuario = historiaUsuario;
    }
    // toString opcional
    @Override
    public String toString() {
        return "Tarea{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", fechaInicio=" + fechaInicio +
                ", fechaFinEstimada=" + fechaFinEstimada +
                ", fechaFinReal=" + fechaFinReal +
                ", prioridad=" + prioridad +
                ", estadoTarea=" + (estadoTarea != null ? estadoTarea.getId() : null) +
                ", proyecto=" + (proyecto != null ? proyecto.getId() : null) +
                ", sprint=" + (sprint != null ? sprint.getId() : null) +
                ", desarrollador=" + (desarrollador != null ? desarrollador.getId() : null) +
                '}';
    }
}