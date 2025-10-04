package com.springboot.MyTodoList.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "dependencia_tarea")
public class DependenciaTarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dependencia_tarea")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_tarea")
    @JsonBackReference
    private Tarea tarea;

    @ManyToOne
    @JoinColumn(name = "id_tarea_dependiente", nullable = false)
    private Tarea tareaDependiente;

    // Constructor sin argumentos
    public DependenciaTarea() {
    }

    // Constructor con todos los campos
    public DependenciaTarea(Long id, Tarea tarea, Tarea tareaDependiente) {
        this.id = id;
        this.tarea = tarea;
        this.tareaDependiente = tareaDependiente;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tarea getTarea() {
        return tarea;
    }

    public void setTarea(Tarea tarea) {
        this.tarea = tarea;
    }

    public Tarea getTareaDependiente() {
        return tareaDependiente;
    }

    public void setTareaDependiente(Tarea tareaDependiente) {
        this.tareaDependiente = tareaDependiente;
    }

    // toString opcional
    @Override
    public String toString() {
        return "DependenciaTarea{" +
                "id=" + id +
                ", tarea=" + (tarea != null ? tarea.getId() : null) +
                ", tareaDependiente=" + (tareaDependiente != null ? tareaDependiente.getId() : null) +
                '}';
    }
}
