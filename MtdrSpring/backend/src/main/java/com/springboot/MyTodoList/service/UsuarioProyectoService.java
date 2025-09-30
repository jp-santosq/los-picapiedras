package com.springboot.MyTodoList.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.UsuarioProyecto;
import com.springboot.MyTodoList.repository.UsuarioProyectoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioProyectoService {

    @Autowired
    private UsuarioProyectoRepository usuarioProyectoRepository;

    // Crear una relación usuario-proyecto
    public UsuarioProyecto addProyecto(UsuarioProyecto newProyecto){
        return usuarioProyectoRepository.save(newProyecto);
    }

    // Obtener todas las relaciones
    public List<UsuarioProyecto> getAllRelaciones() {
        return usuarioProyectoRepository.findAll();
    }

    // Obtener una relación por ID
    public UsuarioProyecto getRelacionById(Long id) {
        Optional<UsuarioProyecto> relacion = usuarioProyectoRepository.findById(id);
        return relacion.orElse(null);
    }

    // Obtener todos los proyectos de un usuario
    public List<UsuarioProyecto> getProyectosByUsuario(Long idUsuario) {
        return usuarioProyectoRepository.findByUsuarioId(idUsuario);
    }

    // Obtener todos los usuarios de un proyecto
    public List<UsuarioProyecto> getUsuariosByProyecto(Long idProyecto) {
        return usuarioProyectoRepository.findByProyectoId(idProyecto);
    }

    // Verificar si existe una relación específica
    public boolean existeRelacion(Long idUsuario, Long idProyecto) {
        return usuarioProyectoRepository.existsByUsuarioIdAndProyectoId(idUsuario, idProyecto);
    }

    // Eliminar una relación por ID
    public boolean deleteRelacion(Long id) {
        if (usuarioProyectoRepository.existsById(id)) {
            usuarioProyectoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Eliminar una relación específica por usuario y proyecto
    public boolean deleteByUsuarioAndProyecto(Long idUsuario, Long idProyecto) {
        Optional<UsuarioProyecto> relacion = usuarioProyectoRepository
                .findByUsuarioIdAndProyectoId(idUsuario, idProyecto);
        if (relacion.isPresent()) {
            usuarioProyectoRepository.delete(relacion.get());
            return true;
        }
        return false;
    }

    // Eliminar todas las relaciones de un usuario
    public void deleteAllByUsuario(Long idUsuario) {
        usuarioProyectoRepository.deleteByUsuarioId(idUsuario);
    }

    // Eliminar todas las relaciones de un proyecto
    public void deleteAllByProyecto(Long idProyecto) {
        usuarioProyectoRepository.deleteByProyectoId(idProyecto);
    }

    // Contar usuarios en un proyecto
    public long countUsuariosByProyecto(Long idProyecto) {
        return usuarioProyectoRepository.countByProyectoId(idProyecto);
    }

    // Contar proyectos de un usuario
    public long countProyectosByUsuario(Long idUsuario) {
        return usuarioProyectoRepository.countByUsuarioId(idUsuario);
    }
}