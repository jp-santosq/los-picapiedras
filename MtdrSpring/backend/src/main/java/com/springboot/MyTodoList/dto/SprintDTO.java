package com.springboot.MyTodoList.dto;

import java.time.LocalDate;

public class SprintDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;
    private LocalDate fechaFinReal;
    private Long proyectoId;

    // Getters y setters
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
    public Long getProyectoId() {
        return proyectoId;
    }
    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }
}
