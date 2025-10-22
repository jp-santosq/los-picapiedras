package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.dto.HorasSprintDTO;
import com.springboot.MyTodoList.dto.HorasSprintUsuarioDTO;
import com.springboot.MyTodoList.service.KPIService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kpi")
public class KPIController {

    private final KPIService service;

    public KPIController(KPIService service) {
        this.service = service;
    }

    @GetMapping("/horas/estimadas/sprint")
    public List<HorasSprintDTO> getEstimadasPorSprint() {
        return service.estimadasPorSprint();
    }

    @GetMapping("/horas/reales/sprint")
    public List<HorasSprintDTO> getRealesPorSprint() {
        return service.realesPorSprint();
    }

    @GetMapping("/horas/estimadas/sprint-desarrollador")
    public List<HorasSprintUsuarioDTO> getEstimadasPorSprintYUsuario() {
        return service.estimadasPorSprintYUsuario();
    }

    @GetMapping("/horas/reales/sprint-desarrollador")
    public List<HorasSprintUsuarioDTO> getRealesPorSprintYUsuario() {
        return service.realesPorSprintYUsuario();
    }
}

