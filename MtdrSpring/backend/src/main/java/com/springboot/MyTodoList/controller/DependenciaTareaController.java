package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.DependenciaTarea;
import com.springboot.MyTodoList.repository.DependenciaTareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dependencias")
public class DependenciaTareaController {

    @Autowired
    private DependenciaTareaRepository repository;

    @GetMapping
    public List<DependenciaTarea> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DependenciaTarea> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DependenciaTarea create(@RequestBody DependenciaTarea dependenciaTarea) {
        return repository.save(dependenciaTarea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DependenciaTarea> update(@PathVariable Long id, @RequestBody DependenciaTarea dependenciaTarea) {
        return repository.findById(id)
                .map(d -> {
                    d.setTarea(dependenciaTarea.getTarea());
                    d.setTareaDependiente(dependenciaTarea.getTareaDependiente());
                    return ResponseEntity.ok(repository.save(d));
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
