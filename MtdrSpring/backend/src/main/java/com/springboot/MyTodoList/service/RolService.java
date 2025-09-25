package com.springboot.MyTodoList.service;

import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.Rol;
import com.springboot.MyTodoList.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class RolService {
    @Autowired
    private RolRepository rolRepository;

    public Rol addRol(Rol newRol){
        return rolRepository.save(newRol);
    }
}
