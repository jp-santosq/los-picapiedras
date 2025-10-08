package com.springboot.MyTodoList.dto;

public class ProyectoDTO {
    private String nombreProyecto;
    private Long administradorId;

    public ProyectoDTO() {}

    public String getNombreProyecto() { return nombreProyecto; }
    public void setNombreProyecto(String nombreProyecto) { this.nombreProyecto = nombreProyecto; }

    public Long getAdministradorId() { return administradorId; }
    public void setAdministradorId(Long administradorId) { this.administradorId = administradorId; }
}
