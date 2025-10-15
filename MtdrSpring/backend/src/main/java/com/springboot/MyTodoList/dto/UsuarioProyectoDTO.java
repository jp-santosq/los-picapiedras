package com.springboot.MyTodoList.dto;

public class UsuarioProyectoDTO {

    private Long id;
    private Long idUsuario;
    private Long idProyecto;
    private UsuarioInfo usuario;
    private ProyectoInfo proyecto;

    // Constructor vacío
    public UsuarioProyectoDTO() {}

    // Constructor simple (para compatibilidad con código existente)
    public UsuarioProyectoDTO(Long id, Long idUsuario, Long idProyecto) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idProyecto = idProyecto;
    }

    // Constructor completo con objetos anidados
    public UsuarioProyectoDTO(Long id, UsuarioInfo usuario, ProyectoInfo proyecto) {
        this.id = id;
        this.usuario = usuario;
        this.proyecto = proyecto;
        if (usuario != null) {
            this.idUsuario = usuario.getId();
        }
        if (proyecto != null) {
            this.idProyecto = proyecto.getId();
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdProyecto() {
        return idProyecto;
    }

    public void setIdProyecto(Long idProyecto) {
        this.idProyecto = idProyecto;
    }

    public UsuarioInfo getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioInfo usuario) {
        this.usuario = usuario;
    }

    public ProyectoInfo getProyecto() {
        return proyecto;
    }

    public void setProyecto(ProyectoInfo proyecto) {
        this.proyecto = proyecto;
    }

    // Método de compatibilidad
    public Long getIdUsuarioProyecto() {
        return id;
    }

    public void setIdUsuarioProyecto(Long idUsuarioProyecto) {
        this.id = idUsuarioProyecto;
    }

    @Override
    public String toString() {
        return "UsuarioProyectoDTO{" +
                "id=" + id +
                ", idUsuario=" + idUsuario +
                ", idProyecto=" + idProyecto +
                ", usuario=" + usuario +
                ", proyecto=" + proyecto +
                '}';
    }

    // Clase interna para información del Usuario
    public static class UsuarioInfo {
        private Long id;
        private String nombreUsuario;
        private String correo;
        private RolInfo rol;

        public UsuarioInfo() {}

        public UsuarioInfo(Long id, String nombreUsuario, String correo, RolInfo rol) {
            this.id = id;
            this.nombreUsuario = nombreUsuario;
            this.correo = correo;
            this.rol = rol;
        }

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

        public RolInfo getRol() {
            return rol;
        }

        public void setRol(RolInfo rol) {
            this.rol = rol;
        }

        @Override
        public String toString() {
            return "UsuarioInfo{" +
                    "id=" + id +
                    ", nombreUsuario='" + nombreUsuario + '\'' +
                    ", correo='" + correo + '\'' +
                    ", rol=" + rol +
                    '}';
        }
    }

    // Clase interna para información del Proyecto
    public static class ProyectoInfo {
        private Long id;
        private String nombreProyecto;

        public ProyectoInfo() {}

        public ProyectoInfo(Long id, String nombreProyecto) {
            this.id = id;
            this.nombreProyecto = nombreProyecto;
        }

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

        @Override
        public String toString() {
            return "ProyectoInfo{" +
                    "id=" + id +
                    ", nombreProyecto='" + nombreProyecto + '\'' +
                    '}';
        }
    }

    // Clase interna para información del Rol
    public static class RolInfo {
        private Long id;

        public RolInfo() {}

        public RolInfo(Long id) {
            this.id = id;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        @Override
        public String toString() {
            return "RolInfo{" +
                    "id=" + id +
                    '}';
        }
    }
}