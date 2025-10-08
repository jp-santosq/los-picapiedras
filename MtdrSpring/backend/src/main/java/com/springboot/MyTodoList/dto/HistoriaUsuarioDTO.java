package com.springboot.MyTodoList.dto;



public class HistoriaUsuarioDTO {
    private String titulo;
    private String descripcion;
    private Long proyectoId; // solo enviamos el ID del proyecto

    // Getters y Setters
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
    public Long getProyectoId() {
        return proyectoId;
    }
    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }
}
