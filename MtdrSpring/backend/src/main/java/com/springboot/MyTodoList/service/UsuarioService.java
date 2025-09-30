package com.springboot.MyTodoList.service;

import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Mostrar todos los usuarios
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    // Añadir Usuario
    public Usuario addUsuario(Usuario newUsuario) {
        // Validar que el correo no exista
        if (usuarioRepository.existsByCorreo(newUsuario.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado: " + newUsuario.getCorreo());
        }
        return usuarioRepository.save(newUsuario);
    }

    // Obtener Usuario por id
    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    // Obtener Usuario por correo
    public Usuario getUsuarioByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
    }

    // Verificar si existe un correo
    public boolean existsByCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    // Buscar usuarios por nombre de usuario
    public List<Usuario> findByNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuarioContainingIgnoreCase(nombreUsuario);
    }

    // Obtener usuarios por modalidad
    public List<Usuario> findByModalidad(String modalidad) {
        return usuarioRepository.findByModalidad(modalidad);
    }

    // Obtener usuarios por rol (ID)
    public List<Usuario> findByRolId(Long rolId) {
        return usuarioRepository.findByRolId(rolId);
    }

    // Obtener usuarios por nombre de rol
    public List<Usuario> findByRolNombre(String nombreRol) {
        return usuarioRepository.findByRolNombre(nombreRol);
    }

    // Búsqueda avanzada con múltiples criterios
    public List<Usuario> searchUsuarios(String nombreUsuario, String correo, String modalidad, Long rolId) {
        return usuarioRepository.findByMultipleCriteria(nombreUsuario, correo, modalidad, rolId);
    }

    // Actualizar Usuario
    public Usuario updateUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = getUsuarioById(id);
        
        // Actualizar solo los campos que no son nulos
        if (usuarioActualizado.getNombreUsuario() != null) {
            usuarioExistente.setNombreUsuario(usuarioActualizado.getNombreUsuario());
        }
        if (usuarioActualizado.getCorreo() != null) {
            // Verificar que el nuevo correo no esté en uso por otro usuario
            if (!usuarioExistente.getCorreo().equals(usuarioActualizado.getCorreo()) 
                && usuarioRepository.existsByCorreo(usuarioActualizado.getCorreo())) {
                throw new RuntimeException("El correo ya está registrado: " + usuarioActualizado.getCorreo());
            }
            usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
        }
        if (usuarioActualizado.getContrasena() != null) {
            usuarioExistente.setContrasena(usuarioActualizado.getContrasena());
        }
        if (usuarioActualizado.getModalidad() != null) {
            usuarioExistente.setModalidad(usuarioActualizado.getModalidad());
        }
        if (usuarioActualizado.getRol() != null) {
            usuarioExistente.setRol(usuarioActualizado.getRol());
        }
        
        return usuarioRepository.save(usuarioExistente);
    }

    // Actualizar solo la contraseña
    public Usuario updateContrasena(Long id, String nuevaContrasena) {
        Usuario usuario = getUsuarioById(id);
        usuario.setContrasena(nuevaContrasena);
        return usuarioRepository.save(usuario);
    }

    // Eliminar Usuario
    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}