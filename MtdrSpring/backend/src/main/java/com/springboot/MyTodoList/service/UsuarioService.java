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
    public List<Usuario> findAll(){
        return usuarioRepository.findAll();
    }

    // Añadir Usuario
    public Usuario addUsuario(Usuario newUsuario){
        return usuarioRepository.save(newUsuario);
    }
}
