package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "proyecto")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proyecto")
    private Long id;

    @Column(name = "nombre_proyecto", nullable = false, length = 60)
    private String nombreProyecto;

    @ManyToOne
    @JoinColumn(name = "id_administrador", nullable = false)
    private Usuario administrador;

    @OneToMany(mappedBy = "proyecto")
    private List<Sprint> sprints = new ArrayList<>();

    // Constructor sin argumentos
    public Proyecto() {
    }

    // Constructor con todos los campos
    public Proyecto(Long id, String nombreProyecto, Usuario administrador, List<Sprint> sprints) {
        this.id = id;
        this.nombreProyecto = nombreProyecto;
        this.administrador = administrador;
        this.sprints = sprints;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreProyecto() {
        return nombreProyecto;
    }

    public void setNombreProyecto(String nombreProyecto) {
        this.nombreProyecto = nombreProyecto;
    }

    public Usuario getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Usuario administrador) {
        this.administrador = administrador;
    }

    public List<Sprint> getSprints() {
        return sprints;
    }

    public void setSprints(List<Sprint> sprints) {
        this.sprints = sprints;
    }

    // toString opcional
    @Override
    public String toString() {
        return "Proyecto{" +
                "id=" + id +
                ", nombreProyecto='" + nombreProyecto + '\'' +
                ", administrador=" + administrador +
                ", sprints=" + sprints +
                '}';
    }
}
