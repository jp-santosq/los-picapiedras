package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.HorasSprintDTO;
import com.springboot.MyTodoList.dto.HorasSprintUsuarioDTO;
import com.springboot.MyTodoList.repository.KPIRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KPIService {
    private final KPIRepository repo;
    public KPIService(KPIRepository repo) { this.repo = repo; }
    public List<HorasSprintDTO> estimadasPorSprint() { return repo.horasEstimadasPorSprint(); }
    public List<HorasSprintDTO> realesPorSprint() { return repo.horasRealesPorSprint(); }
    public List<HorasSprintUsuarioDTO> estimadasPorSprintYUsuario() { return repo.horasEstimadasPorSprintYUsuario(); }
    public List<HorasSprintUsuarioDTO> realesPorSprintYUsuario() { return repo.horasRealesPorSprintYUsuario(); }
}

