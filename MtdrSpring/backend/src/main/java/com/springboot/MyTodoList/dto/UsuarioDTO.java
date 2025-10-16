package com.springboot.MyTodoList.dto;

import com.springboot.MyTodoList.model.Rol;

public class UsuarioDTO {

    private Long id;
    private String nombreUsuario;
    private String correo;
    private String modalidad;
    private Long rolId; // Solo el id del rol, para no exponer toda la entidad

    // Constructor vacío
    public UsuarioDTO() {
    }

    // Constructor con todos los campos
    public UsuarioDTO(Long id, String nombreUsuario, String correo, String modalidad, Long rolId) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.modalidad = modalidad;
        this.rolId = rolId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public Long getRolId() {
        return rolId;
    }

    public void setRolId(Long rolId) {
        this.rolId = rolId;
    }

    // Método de conveniencia para convertir de Usuario a UsuarioDTO
    public static UsuarioDTO fromEntity(com.springboot.MyTodoList.model.Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNombreUsuario(),
            usuario.getCorreo(),
            usuario.getModalidad(),
            usuario.getRol() != null ? usuario.getRol().getId() : null
        );
    }
}