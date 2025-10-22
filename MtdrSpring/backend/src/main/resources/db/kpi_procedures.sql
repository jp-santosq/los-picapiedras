CREATE OR REPLACE PROCEDURE KPI_HORAS_ESTIMADAS_POR_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint AS sprint_id,
    s.fecha_inicio AS sprint_inicio,
    s.fecha_fin_estimada AS sprint_fin,
    ROUND(SUM((t.fecha_fin_estimada - t.fecha_inicio) * 8), 2) AS horas
  FROM tarea t
  JOIN sprint s ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_estimada IS NOT NULL AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, s.fecha_inicio, s.fecha_fin_estimada
  ORDER BY s.id_sprint;
END;
/

CREATE OR REPLACE PROCEDURE KPI_HORAS_REALES_POR_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint AS sprint_id,
    s.fecha_inicio AS sprint_inicio,
    s.fecha_fin_estimada AS sprint_fin,
    ROUND(SUM((t.fecha_fin_real - t.fecha_inicio) * 8), 2) AS horas
  FROM tarea t
  JOIN sprint s ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_real IS NOT NULL AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, s.fecha_inicio, s.fecha_fin_estimada
  ORDER BY s.id_sprint;
END;
/

CREATE OR REPLACE PROCEDURE KPI_HORAS_ESTIMADAS_POR_DESA_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint AS sprint_id,
    s.fecha_inicio AS sprint_inicio,
    s.fecha_fin_estimada AS sprint_fin,
    u.id_usuario AS dev_id,
    u.nombre_usuario AS dev_nombre,
    ROUND(SUM((t.fecha_fin_estimada - t.fecha_inicio) * 8), 2) AS horas
  FROM tarea t
  JOIN usuario u ON t.id_desarrollador = u.id_usuario
  JOIN sprint s  ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_estimada IS NOT NULL AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, s.fecha_inicio, s.fecha_fin_estimada, u.id_usuario, u.nombre_usuario
  ORDER BY s.id_sprint, u.id_usuario;
END;
/

CREATE OR REPLACE PROCEDURE KPI_HORAS_REALES_POR_DESA_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint AS sprint_id,
    s.fecha_inicio AS sprint_inicio,
    s.fecha_fin_real AS sprint_fin,
    u.id_usuario AS dev_id,
    u.nombre_usuario AS dev_nombre,
    ROUND(SUM((t.fecha_fin_real - t.fecha_inicio) * 8), 2) AS horas
  FROM tarea t
  JOIN usuario u ON t.id_desarrollador = u.id_usuario
  JOIN sprint s  ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_real IS NOT NULL AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, s.fecha_inicio, s.fecha_fin_real, u.id_usuario, u.nombre_usuario
  ORDER BY s.id_sprint, u.id_usuario;
END;
/
