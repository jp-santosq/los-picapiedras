package com.springboot.MyTodoList.model;

import jakarta.persistence.*;

@Entity
@Table(name = "estado_tarea")
public class EstadoTarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estado_tarea")
    private Long id;

    @Column(name = "nombre_estado", length = 30)
    private String nombreEstado;

    // Constructor sin argumentos
    public EstadoTarea() {
    }

    // Constructor con todos los campos
    public EstadoTarea(Long id, String nombreEstado) {
        this.id = id;
        this.nombreEstado = nombreEstado;
    }

    // Getter y Setter para id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter y Setter para nombreEstado
    public String getNombreEstado() {
        return nombreEstado;
    }

    public void setNombreEstado(String nombreEstado) {
        this.nombreEstado = nombreEstado;
    }

    // Método toString opcional
    @Override
    public String toString() {
        return "EstadoTarea{" +
                "id=" + id +
                ", nombreEstado='" + nombreEstado + '\'' +
                '}';
    }
}
