package com.springboot.MyTodoList.config;

import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import com.springboot.MyTodoList.model.*;
import com.springboot.MyTodoList.repository.*;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ClassPathResource;
import java.util.Scanner;
import jakarta.persistence.EntityManager;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstadoTareaRepository estadoTareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private HistoriaUsuarioRepository historiaUsuarioRepository;

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    @Override
    public void run(String... args) throws Exception {
        createVectorTable();
        

        boolean datosYaExisten = usuarioRepository.count() > 0 || 
                                 proyectoRepository.count() > 0 ||
                                 estadoTareaRepository.count() > 0;
        
        if (datosYaExisten) {
            System.out.println("⚠️ Datos ya inicializados, saltando carga de datos...");
            createKpiProceduresFromFile();
            return;
        }

        System.out.println("🚀 Iniciando carga de datos iniciales...");

        // Crear roles
        Rol superadmin = new Rol();
        superadmin.setNombreRol("Superadmin");
        superadmin = rolRepository.save(superadmin);

        Rol admin = new Rol();
        admin.setNombreRol("Administrador");
        admin = rolRepository.save(admin);

        Rol dev = new Rol();
        dev.setNombreRol("Desarrollador");
        dev = rolRepository.save(dev);

        System.out.println("✓ Roles creados correctamente");

        // Usuarios
        Usuario jose = new Usuario();
        jose.setNombreUsuario("Jose Pablo Santos");
        jose.setCorreo("admin@oracle.com");
        jose.setPassword(passwordEncoder.encode("12345"));
        jose.setModalidad("Presencial");
        jose.setRol(admin);
        usuarioRepository.save(jose);

        Usuario pedro = new Usuario();
        pedro.setNombreUsuario("Pedro Sanchez");
        pedro.setCorreo("pedro.sanchez@oracle.com");
        pedro.setPassword(passwordEncoder.encode("12345"));
        pedro.setModalidad("Remoto");
        pedro.setRol(dev);
        usuarioRepository.save(pedro);

        Usuario ale = new Usuario();
        ale.setNombreUsuario("Ale Teran");
        ale.setCorreo("ale.teran@oracle.com");
        ale.setPassword(passwordEncoder.encode("12345"));
        ale.setModalidad("Presencial");
        ale.setRol(dev);
        usuarioRepository.save(ale);

        Usuario david = new Usuario();
        david.setNombreUsuario("David Martinez");
        david.setCorreo("david.martinez@oracle.com");
        david.setPassword(passwordEncoder.encode("12345"));
        david.setModalidad("Remoto");
        david.setRol(dev);
        usuarioRepository.save(david);

        Usuario christel = new Usuario();
        christel.setNombreUsuario("Christel Gomez");
        christel.setCorreo("christel.gomez@oracle.com");
        christel.setPassword(passwordEncoder.encode("12345"));
        christel.setModalidad("Remoto");
        christel.setRol(superadmin);
        usuarioRepository.save(christel);

        System.out.println("✓ Usuarios creados correctamente");

        // Estados de tarea
        EstadoTarea pendiente = new EstadoTarea();
        pendiente.setNombreEstado("Pendiente");
        estadoTareaRepository.save(pendiente);

        EstadoTarea enProceso = new EstadoTarea();
        enProceso.setNombreEstado("En Proceso");
        estadoTareaRepository.save(enProceso);

        EstadoTarea enRevision = new EstadoTarea();
        enRevision.setNombreEstado("En Revisión");
        estadoTareaRepository.save(enRevision);

        EstadoTarea completado = new EstadoTarea();
        completado.setNombreEstado("Completado");
        estadoTareaRepository.save(completado);

        System.out.println("✓ Estados de tarea creados correctamente");

        // Proyecto
        Proyecto proyecto = new Proyecto();
        proyecto.setNombreProyecto("Oracle Java Bot");
        proyecto.setAdministrador(jose);
        proyectoRepository.save(proyecto);

        System.out.println("✓ Proyecto creado correctamente");

        // Sprints
        Sprint sprint1 = new Sprint();
        sprint1.setFechaInicio(LocalDate.of(2025, 10, 5));
        sprint1.setFechaFinEstimada(LocalDate.of(2025, 10, 12));
        sprint1.setProyecto(proyecto);
        sprintRepository.save(sprint1);

        Sprint sprint2 = new Sprint();
        sprint2.setFechaInicio(LocalDate.of(2025, 10, 13));
        sprint2.setFechaFinEstimada(LocalDate.of(2025, 10, 20));
        sprint2.setProyecto(proyecto);
        sprintRepository.save(sprint2);

        System.out.println("✓ Sprints creados correctamente");

        // Historia de usuario
        HistoriaUsuario historia = new HistoriaUsuario();
        historia.setTitulo("Oracle Java Bot");
        historia.setDescripcion("Como usuario quiero manejar mi proyecto para llevar control");
        historia.setProyecto(proyecto);
        historiaUsuarioRepository.save(historia);

        System.out.println("✓ Historia de usuario creada correctamente");

        // Tareas
        Tarea tarea1 = new Tarea();
        tarea1.setTitulo("Configurar entorno de desarrollo");
        tarea1.setDescripcion("Preparar el proyecto base en Spring Boot y conectar con Oracle DB");
        tarea1.setFechaInicio(LocalDate.of(2025, 10, 5));
        tarea1.setFechaFinEstimada(LocalDate.of(2025, 10, 7));
        tarea1.setPrioridad(1);
        tarea1.setEstadoTarea(pendiente);
        tarea1.setProyecto(proyecto);
        tarea1.setSprint(sprint1);
        tarea1.setDesarrollador(ale);
        tarea1.setHistoriaUsuario(historia);
        tareaRepository.save(tarea1);

        Tarea tarea2 = new Tarea();
        tarea2.setTitulo("Crear estructura de API REST");
        tarea2.setDescripcion("Diseñar los controladores, servicios y modelos del bot");
        tarea2.setFechaInicio(LocalDate.of(2025, 10, 6));
        tarea2.setFechaFinEstimada(LocalDate.of(2025, 10, 9));
        tarea2.setPrioridad(2);
        tarea2.setEstadoTarea(pendiente);
        tarea2.setProyecto(proyecto);
        tarea2.setSprint(sprint1);
        tarea2.setDesarrollador(ale);
        tarea2.setHistoriaUsuario(historia);
        tareaRepository.save(tarea2);

        Tarea tarea3 = new Tarea();
        tarea3.setTitulo("Integrar chat básico con consola");
        tarea3.setDescripcion("Implementar flujo inicial de conversación con entrada y salida de texto");
        tarea3.setFechaInicio(LocalDate.of(2025, 10, 8));
        tarea3.setFechaFinEstimada(LocalDate.of(2025, 10, 12));
        tarea3.setPrioridad(2);
        tarea3.setEstadoTarea(pendiente);
        tarea3.setProyecto(proyecto);
        tarea3.setSprint(sprint1);
        tarea3.setDesarrollador(pedro);
        tarea3.setHistoriaUsuario(historia);
        tareaRepository.save(tarea3);

        Tarea tarea4 = new Tarea();
        tarea4.setTitulo("Integrar modelo de NLP");
        tarea4.setDescripcion("Conectar el bot con una librería de procesamiento de lenguaje natural");
        tarea4.setFechaInicio(LocalDate.of(2025, 10, 13));
        tarea4.setFechaFinEstimada(LocalDate.of(2025, 10, 16));
        tarea4.setPrioridad(1);
        tarea4.setEstadoTarea(pendiente);
        tarea4.setProyecto(proyecto);
        tarea4.setSprint(sprint2);
        tarea4.setDesarrollador(ale);
        tarea4.setHistoriaUsuario(historia);
        tareaRepository.save(tarea4);

        Tarea tarea5 = new Tarea();
        tarea5.setTitulo("Diseñar base de conocimiento");
        tarea5.setDescripcion("Crear la estructura de base de datos para respuestas frecuentes");
        tarea5.setFechaInicio(LocalDate.of(2025, 10, 14));
        tarea5.setFechaFinEstimada(LocalDate.of(2025, 10, 18));
        tarea5.setPrioridad(2);
        tarea5.setEstadoTarea(pendiente);
        tarea5.setProyecto(proyecto);
        tarea5.setSprint(sprint2);
        tarea5.setDesarrollador(pedro);
        tarea5.setHistoriaUsuario(historia);
        tareaRepository.save(tarea5);

        Tarea tarea6 = new Tarea();
        tarea6.setTitulo("Pruebas de conversación y métricas");
        tarea6.setDescripcion("Probar las interacciones del bot y registrar KPIs de precisión");
        tarea6.setFechaInicio(LocalDate.of(2025, 10, 17));
        tarea6.setFechaFinEstimada(LocalDate.of(2025, 10, 20));
        tarea6.setPrioridad(3);
        tarea6.setEstadoTarea(pendiente);
        tarea6.setProyecto(proyecto);
        tarea6.setSprint(sprint2);
        tarea6.setDesarrollador(david);
        tarea6.setHistoriaUsuario(historia);
        tareaRepository.save(tarea6);

        System.out.println("✓ Tareas creadas correctamente");
        System.out.println("✅ Datos cargados exitosamente!");
        
        createKpiProceduresFromFile();
    }

    private void createVectorTable() {
        String createTable =
                "BEGIN\n" +
                "    EXECUTE IMMEDIATE '\n" +
                "        CREATE TABLE rag_document_chunk (\n" +
                "            id NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,\n" +
                "            file_name VARCHAR2(255) NOT NULL,\n" +
                "            mime_type VARCHAR2(100),\n" +
                "            chunk_index NUMBER NOT NULL,\n" +
                "            chunk_text CLOB,\n" +
                "            embedding_json CLOB,\n" +
                "            embedding_dims NUMBER,\n" +
                "            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n" +
                "        )';\n" +
                "EXCEPTION\n" +
                "    WHEN OTHERS THEN\n" +
                "        IF SQLCODE != -955 THEN\n" +
                "            RAISE;\n" +
                "        END IF;\n" +
                "END;";

        String createIndex =
                "BEGIN\n" +
                "    EXECUTE IMMEDIATE '\n" +
                "        CREATE INDEX idx_rag_chunks_file ON rag_document_chunk(file_name)';\n" +
                "EXCEPTION\n" +
                "    WHEN OTHERS THEN\n" +
                "        IF SQLCODE != -955 THEN\n" +
                "            RAISE;\n" +
                "        END IF;\n" +
                "END;";

        try {
            jdbcTemplate.execute(createTable);
            jdbcTemplate.execute(createIndex);
            System.out.println("✓ Tabla vectorial 'rag_document_chunk' lista para embeddings.");
        } catch (Exception e) {
            System.err.println("⚠️ No se pudo crear la tabla de vectores: " + e.getMessage());
        }
    }

    private void createKpiProceduresFromFile() {
        try {
            ClassPathResource resource = new ClassPathResource("db/kpi_procedures.sql");
            try (InputStream in = resource.getInputStream();
                Scanner scanner = new Scanner(in, StandardCharsets.UTF_8)) {
                scanner.useDelimiter("/");
                while (scanner.hasNext()) {
                    String ddl = scanner.next().trim();
                    if (!ddl.isEmpty()) {
                        jdbcTemplate.execute(ddl);
                        System.out.println("✓ Bloque SQL ejecutado correctamente");
                    }
                }
            }
            System.out.println("✅ Procedimientos KPI creados exitosamente desde archivo");
        } catch (Exception e) {
            System.err.println("⚠️ Error al cargar procedimientos KPI: " + e.getMessage());
        }
    }
}