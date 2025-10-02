package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tarea")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Long id;

    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin_estimada", nullable = false)
    private LocalDate fechaFinEstimada;

    @Column(name = "fecha_fin_real")
    private LocalDate fechaFinReal;

    @ManyToOne
    @JoinColumn(name = "id_estado_tarea", nullable = false)
    private EstadoTarea estado;

    @ManyToOne
    @JoinColumn(name = "id_sprint", nullable = false)
    private Sprint sprint;

    // Constructor sin argumentos
    public Tarea() {
    }

    // Constructor con todos los campos
    public Tarea(Long id, String descripcion, LocalDate fechaInicio, LocalDate fechaFinEstimada, LocalDate fechaFinReal, EstadoTarea estado, Sprint sprint) {
        this.id = id;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFinEstimada = fechaFinEstimada;
        this.fechaFinReal = fechaFinReal;
        this.estado = estado;
        this.sprint = sprint;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public EstadoTarea getEstado() {
        return estado;
    }

    public void setEstado(EstadoTarea estado) {
        this.estado = estado;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    // toString opcional
    @Override
    public String toString() {
        return "Tarea{" +
                "id=" + id +
                ", descripcion='" + descripcion + '\'' +
                ", fechaInicio=" + fechaInicio +
                ", fechaFinEstimada=" + fechaFinEstimada +
                ", fechaFinReal=" + fechaFinReal +
                ", estado=" + estado +
                ", sprint=" + sprint +
                '}';
    }
}
