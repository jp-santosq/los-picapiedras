package com.springboot.MyTodoList.dto;

import java.time.LocalDate;

public class HorasSprintUsuarioDTO {
    private Long sprintId;
    private LocalDate sprintInicio;
    private LocalDate sprintFin;
    private Long usuarioId;
    private String usuarioNombre;
    private Double horas;

    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }

    public LocalDate getSprintInicio() { return sprintInicio; }
    public void setSprintInicio(LocalDate sprintInicio) { this.sprintInicio = sprintInicio; }

    public LocalDate getSprintFin() { return sprintFin; }
    public void setSprintFin(LocalDate sprintFin) { this.sprintFin = sprintFin; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public Double getHoras() { return horas; }
    public void setHoras(Double horas) { this.horas = horas; }
}

