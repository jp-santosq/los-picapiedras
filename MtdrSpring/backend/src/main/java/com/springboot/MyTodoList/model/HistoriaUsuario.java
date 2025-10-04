package com.springboot.MyTodoList.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "historia_usuario")
public class HistoriaUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historia_usuario")
    private Long id;

    @Column(nullable = false, length = 60)
    private String titulo;

    @Column(length = 100)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @OneToMany(mappedBy = "historiaUsuario")
    @JsonManagedReference
    private List<Tarea> tareas;

    // Getters/Setters/Constructores
    // Constructor sin argumentos
    public HistoriaUsuario() {
    }

    // Constructor con todos los campos
    public HistoriaUsuario(Long id, String titulo, String descripcion, Proyecto proyecto, List<Tarea> tareas) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
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

    @Override
    public String toString() {
        return "HistoriaUsuario{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", proyecto=" + (proyecto != null ? proyecto.getId() : null) +
                ", tareas=" + (tareas != null ? tareas.size() : 0) +
                '}';
    }
}