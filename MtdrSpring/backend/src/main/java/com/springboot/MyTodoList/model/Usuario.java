package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombre_usuario", nullable = false, length = 60)
    private String nombreUsuario;

    @Column(nullable = false, length = 20)
    private String password;

    @Column(nullable = false, length = 30)
    private String modalidad;

    @Column(name="correo",nullable = false, length=60)
    private String correo;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;


    // Constructor sin argumentos
    public Usuario() {
    }

    // Constructor con todos los campos
    public Usuario(Long id, String nombreUsuario, String correo, String password,
                   String modalidad, Rol rol, List<Proyecto> proyectosAdministrados) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.password = password;
        this.modalidad = modalidad;
        this.rol = rol;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCorreo(){
        return correo;
    }

    public void setCorreo(String correo){
        this.correo=correo;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    // Constructor que solo asigna el id
    public Usuario(Long id) {
        this.id = id;
    }

    // toString opcional
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombreUsuario='" + nombreUsuario + '\'' +
                ", correo='" + correo + '\'' +
                ", modalidad='" + modalidad + '\'' +
                ", rol=" + (rol != null ? rol.getId() : null) +
                '}';
    }
}
