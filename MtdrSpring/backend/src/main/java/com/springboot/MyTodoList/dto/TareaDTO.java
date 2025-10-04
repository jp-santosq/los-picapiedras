package com.springboot.MyTodoList.dto;

import java.time.LocalDate;

public class TareaDTO {
    public String titulo;
    public String descripcion;
    public LocalDate fechaInicio;
    public LocalDate fechaFinEstimada;
    public LocalDate fechaFinReal;
    public Integer prioridad;
    public Long estadoTareaId;
    public Long proyectoId;
    public Long sprintId;          // opcional
    public Long desarrolladorId;   // opcional
    public Long historiaUsuarioId; // obligatorio

}
