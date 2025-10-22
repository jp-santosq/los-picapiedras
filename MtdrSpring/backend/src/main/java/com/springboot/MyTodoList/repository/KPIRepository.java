package com.springboot.MyTodoList.repository;
import com.springboot.MyTodoList.dto.HorasSprintDTO;
import com.springboot.MyTodoList.dto.HorasSprintUsuarioDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Repository
public class KPIRepository {

    private final EntityManager em;

    public KPIRepository(EntityManager em) {
        this.em = em;
    }

    public List<HorasSprintDTO> horasEstimadasPorSprint() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("LOSPICAPIEDRAS.KPI_HORAS_ESTIMADAS_POR_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintDTO dto = new HorasSprintDTO();
            // r[0]=sprint_id, r[1]=sprint_inicio, r[2]=sprint_fin, r[3]=horas
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Date) r[1]).toLocalDate());
            dto.setSprintFin(((Date) r[2]).toLocalDate());
            dto.setHoras(r[3] != null ? ((Number) r[3]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintDTO> horasRealesPorSprint() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("LOSPICAPIEDRAS.KPI_HORAS_REALES_POR_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintDTO dto = new HorasSprintDTO();
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Date) r[1]).toLocalDate());
            dto.setSprintFin(((Date) r[2]).toLocalDate());
            dto.setHoras(r[3] != null ? ((Number) r[3]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintUsuarioDTO> horasEstimadasPorSprintYUsuario() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("LOSPICAPIEDRAS.KPI_HORAS_ESTIMADAS_POR_DESA_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintUsuarioDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintUsuarioDTO dto = new HorasSprintUsuarioDTO();
            // 0=sprint_id, 1=inicio, 2=fin, 3=dev_id, 4=dev_nombre, 5=horas
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Date) r[1]).toLocalDate());
            dto.setSprintFin(((Date) r[2]).toLocalDate());
            dto.setUsuarioId(((Number) r[3]).longValue());
            dto.setUsuarioNombre((String) r[4]);
            dto.setHoras(r[5] != null ? ((Number) r[5]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintUsuarioDTO> horasRealesPorSprintYUsuario() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("LOSPICAPIEDRAS.KPI_HORAS_REALES_POR_DESA_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintUsuarioDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintUsuarioDTO dto = new HorasSprintUsuarioDTO();
            // 0=sprint_id, 1=inicio, 2=fin, 3=dev_id, 4=dev_nombre, 5=horas
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Date) r[1]).toLocalDate());
            dto.setSprintFin(((Date) r[2]).toLocalDate());
            dto.setUsuarioId(((Number) r[3]).longValue());
            dto.setUsuarioNombre((String) r[4]);
            dto.setHoras(r[5] != null ? ((Number) r[5]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }
}

