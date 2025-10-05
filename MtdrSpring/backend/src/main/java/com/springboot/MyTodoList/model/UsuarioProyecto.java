package com.springboot.MyTodoList.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_proyecto")
public class UsuarioProyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_proyecto")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    // Constructor sin argumentos
    public UsuarioProyecto() {
    }

    // Constructor con todos los campos
    public UsuarioProyecto(Long id, Usuario usuario, Proyecto proyecto) {
        this.id = id;
        this.usuario = usuario;
        this.proyecto = proyecto;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    // toString opcional
    @Override
    public String toString() {
        return "UsuarioProyecto{" +
                "id=" + id +
                ", usuario=" + usuario +
                ", proyecto=" + proyecto +
                '}';
    }
}
