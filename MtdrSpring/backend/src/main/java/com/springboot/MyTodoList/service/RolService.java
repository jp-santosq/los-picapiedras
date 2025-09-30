package com.springboot.MyTodoList.service;

import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.model.Rol;
import com.springboot.MyTodoList.repository.RolRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;


@Service
public class RolService {
    @Autowired
    private RolRepository rolRepository;


    //Metodo para añadir un Rol
    public Rol addRol(Rol newRol){
        return rolRepository.save(newRol);
    }

    //Metodo para mostrar todos los Roles
    public List<Rol> findAll(){
        return rolRepository.findAll();
    }

}
