package com.springboot.MyTodoList.service;

import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Usuario;
import com.springboot.MyTodoList.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public Usuario authenticateUser(String email, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreo(email);
        if (usuario.isPresent() && usuario.get().getPassword().equals(password)) {
            return usuario.get();
        }
        return null;
    }

    // Mostrar todos los usuarios
    public List<Usuario> findAll(){
        return usuarioRepository.findAll();
    }

    // Añadir Usuario
    public Usuario addUsuario(Usuario newUsuario){
        return usuarioRepository.save(newUsuario);
    }

    // Obtener usuarios por id de rol
    public List<Usuario> getUsuariosByIdRol(Long idRol){
        return usuarioRepository.findByRolId(idRol);
    }
}
