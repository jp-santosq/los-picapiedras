package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.dto.HorasSprintDTO;
import com.springboot.MyTodoList.dto.HorasSprintUsuarioDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Repository
public class KPIRepository {

    private final EntityManager em;

    public KPIRepository(EntityManager em) {
        this.em = em;
    }

    public List<HorasSprintDTO> horasEstimadasPorSprint() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("KPI_HORAS_ESTIMADAS_POR_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintDTO dto = new HorasSprintDTO();
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Timestamp) r[1]).toLocalDateTime().toLocalDate());
            dto.setSprintFin(((Timestamp) r[2]).toLocalDateTime().toLocalDate());
            dto.setHoras(r[3] != null ? ((Number) r[3]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintDTO> horasRealesPorSprint() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("KPI_HORAS_REALES_POR_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintDTO dto = new HorasSprintDTO();
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Timestamp) r[1]).toLocalDateTime().toLocalDate());
            dto.setSprintFin(((Timestamp) r[2]).toLocalDateTime().toLocalDate());
            dto.setHoras(r[3] != null ? ((Number) r[3]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintUsuarioDTO> horasEstimadasPorSprintYUsuario() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("KPI_HORAS_ESTIMADAS_POR_DESA_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintUsuarioDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintUsuarioDTO dto = new HorasSprintUsuarioDTO();
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Timestamp) r[1]).toLocalDateTime().toLocalDate());
            dto.setSprintFin(((Timestamp) r[2]).toLocalDateTime().toLocalDate());
            dto.setUsuarioId(((Number) r[3]).longValue());
            dto.setUsuarioNombre((String) r[4]);
            dto.setHoras(r[5] != null ? ((Number) r[5]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }

    public List<HorasSprintUsuarioDTO> horasRealesPorSprintYUsuario() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("KPI_HORAS_REALES_POR_DESA_SPRINT");
        q.registerStoredProcedureParameter(1, void.class, ParameterMode.REF_CURSOR);
        q.execute();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<HorasSprintUsuarioDTO> out = new ArrayList<>();
        for (Object[] r : rows) {
            HorasSprintUsuarioDTO dto = new HorasSprintUsuarioDTO();
            dto.setSprintId(((Number) r[0]).longValue());
            dto.setSprintInicio(((Timestamp) r[1]).toLocalDateTime().toLocalDate());
            dto.setSprintFin(((Timestamp) r[2]).toLocalDateTime().toLocalDate());
            dto.setUsuarioId(((Number) r[3]).longValue());
            dto.setUsuarioNombre((String) r[4]);
            dto.setHoras(r[5] != null ? ((Number) r[5]).doubleValue() : 0.0);
            out.add(dto);
        }
        return out;
    }
}

