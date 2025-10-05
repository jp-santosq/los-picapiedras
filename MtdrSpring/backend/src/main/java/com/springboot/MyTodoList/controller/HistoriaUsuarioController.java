package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.dto.HistoriaUsuarioDTO;
import com.springboot.MyTodoList.model.HistoriaUsuario;
import com.springboot.MyTodoList.model.Proyecto;
import com.springboot.MyTodoList.repository.HistoriaUsuarioRepository;
import com.springboot.MyTodoList.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historias")
public class HistoriaUsuarioController {

    @Autowired
    private HistoriaUsuarioRepository repository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @GetMapping
    public List<HistoriaUsuario> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoriaUsuario> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HistoriaUsuario> create(@RequestBody HistoriaUsuarioDTO dto) {
        Proyecto proyecto = proyectoRepository.findById(dto.getProyectoId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        HistoriaUsuario historia = new HistoriaUsuario();
        historia.setTitulo(dto.getTitulo());
        historia.setDescripcion(dto.getDescripcion());
        historia.setProyecto(proyecto);

        HistoriaUsuario saved = repository.save(historia);
        return ResponseEntity.ok(saved);
}


    @PutMapping("/{id}")
    public ResponseEntity<HistoriaUsuario> update(@PathVariable Long id, @RequestBody HistoriaUsuario historiaUsuario) {
        return repository.findById(id)
                .map(h -> {
                    h.setTitulo(historiaUsuario.getTitulo());
                    h.setDescripcion(historiaUsuario.getDescripcion());
                    h.setProyecto(historiaUsuario.getProyecto());
                    return ResponseEntity.ok(repository.save(h));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
