package com.springboot.MyTodoList.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.model.Sprint;

@Service
public class SprintService {
    @Autowired
    private SprintRepository sprintRepository;

    public Sprint addSprint(Sprint newSprint){
        return sprintRepository.save(newSprint);
    }   
}
