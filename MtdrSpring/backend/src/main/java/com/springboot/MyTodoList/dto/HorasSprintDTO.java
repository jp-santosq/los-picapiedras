package com.springboot.MyTodoList.dto;

import java.time.LocalDate;

public class HorasSprintDTO {
    private Long sprintId;
    private LocalDate sprintInicio;
    private LocalDate sprintFin;
    private Double horas;

    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }

    public LocalDate getSprintInicio() { return sprintInicio; }
    public void setSprintInicio(LocalDate sprintInicio) { this.sprintInicio = sprintInicio; }

    public LocalDate getSprintFin() { return sprintFin; }
    public void setSprintFin(LocalDate sprintFin) { this.sprintFin = sprintFin; }

    public Double getHoras() { return horas; }
    public void setHoras(Double horas) { this.horas = horas; }
}

