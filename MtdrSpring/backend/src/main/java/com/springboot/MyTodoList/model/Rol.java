package com.springboot.MyTodoList.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long id;

    @Column(name = "nombre_rol", nullable = false, length = 30)
    private String nombreRol;

    // Constructor sin argumentos
    public Rol() {
    }

    // Constructor con todos los campos
    public Rol(Long id, String nombreRol) {
        this.id = id;
        this.nombreRol = nombreRol;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreRol() {
        return nombreRol;
    }

    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }

    // toString opcional
    @Override
    public String toString() {
        return "Rol{" +
                "id=" + id +
                ", nombreRol='" + nombreRol + '\'' +
                '}';
    }
}
