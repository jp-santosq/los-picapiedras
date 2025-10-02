package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "sprint")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sprint")
    private Long id;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin_estimada", nullable = false)
    private LocalDate fechaFinEstimada;

    @Column(name = "fecha_fin_real")
    private LocalDate fechaFinReal;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @OneToMany(mappedBy = "sprint")
    private List<Tarea> tareas = new ArrayList<>();

    // Constructor sin argumentos
    public Sprint() {
    }

    // Constructor con todos los campos
    public Sprint(Long id, LocalDate fechaInicio, LocalDate fechaFinEstimada, LocalDate fechaFinReal, Proyecto proyecto, List<Tarea> tareas) {
        this.id = id;
        this.fechaInicio = fechaInicio;
        this.fechaFinEstimada = fechaFinEstimada;
        this.fechaFinReal = fechaFinReal;
        this.proyecto = proyecto;
        this.tareas = tareas;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    public List<Tarea> getTareas() {
        return tareas;
    }

    public void setTareas(List<Tarea> tareas) {
        this.tareas = tareas;
    }

    // toString opcional
    @Override
    public String toString() {
        return "Sprint{" +
                "id=" + id +
                ", fechaInicio=" + fechaInicio +
                ", fechaFinEstimada=" + fechaFinEstimada +
                ", fechaFinReal=" + fechaFinReal +
                ", proyecto=" + proyecto +
                ", tareas=" + tareas +
                '}';
    }
}
