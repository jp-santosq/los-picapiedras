package com.springboot.MyTodoList.dto;
import com.springboot.MyTodoList.model.Rol;

public class AuthResponseDTO {
    private String token;
    private Rol rol;
    private Long id_usuario;
    private String nombreUsuario;
    private String correo;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, Long id_usuario, Rol rol, String nombreUsuario, String correo) {
        this.token = token;
        this.id_usuario = id_usuario;
        this.rol = rol;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
    }

    public String getToken() { return token;}
    public void setToken(String token) { this.token = token;}
    public Long getId() { return id_usuario;}
    public void setId(Long id_usuario) { this.id_usuario = id_usuario;}
    public Rol getRol() { return rol;}
    public void setRol(Rol rol) { this.rol = rol;}
    public String getNombreUsuario() { return nombreUsuario;}
    public void setNombreUsuario(String nombreUsuario) {this.nombreUsuario = nombreUsuario;}
    public String getCorreo() { return correo;}
    public void setCorreo(String correo) {this.correo = correo;}
}
