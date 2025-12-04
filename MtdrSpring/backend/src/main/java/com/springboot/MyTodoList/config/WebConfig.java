package com.springboot.MyTodoList.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebConfig {

    // Redirige todas las rutas de la aplicación React a index.html, excluyendo rutas con extensiones (archivos estáticos)
    @GetMapping(value = {
        "/",
        "/login",
        "/app",
        "/sprints",
        "/tasks",
        "/kpis",
        "/about",
        "/team",
        "/sprint",
        "/knowledge",
        "/profile"
    })


    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}