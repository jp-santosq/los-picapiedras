-- ===========================================================
-- Horas estimadas por sprint
-- ===========================================================
CREATE OR REPLACE PROCEDURE KPI_HORAS_ESTIMADAS_POR_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint                AS sprint_id,
    TRUNC(s.fecha_inicio)      AS sprint_inicio,
    TRUNC(s.fecha_fin_estimada) AS sprint_fin,
    ROUND(SUM((t.fecha_fin_estimada - t.fecha_inicio) * 1), 2) AS horas
  FROM tarea t
  JOIN sprint s ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_estimada IS NOT NULL
    AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, TRUNC(s.fecha_inicio), TRUNC(s.fecha_fin_estimada)
  ORDER BY s.id_sprint;
END;
/
-- ===========================================================
-- Horas reales por sprint
-- ===========================================================
CREATE OR REPLACE PROCEDURE KPI_HORAS_REALES_POR_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint                AS sprint_id,
    TRUNC(s.fecha_inicio)      AS sprint_inicio,
    TRUNC(s.fecha_fin_estimada) AS sprint_fin, -- use estimated end if real missing
    ROUND(SUM((NVL(t.fecha_fin_real, t.fecha_fin_estimada) - t.fecha_inicio) * 1), 2) AS horas
  FROM tarea t
  JOIN sprint s ON t.id_sprint = s.id_sprint
  WHERE t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, TRUNC(s.fecha_inicio), TRUNC(s.fecha_fin_estimada)
  ORDER BY s.id_sprint;
END;
/
-- ===========================================================
-- Horas estimadas por desarrollador y sprint
-- ===========================================================
CREATE OR REPLACE PROCEDURE KPI_HORAS_ESTIMADAS_POR_DESA_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint                AS sprint_id,
    TRUNC(s.fecha_inicio)      AS sprint_inicio,
    TRUNC(s.fecha_fin_estimada) AS sprint_fin,
    u.id_usuario               AS usuario_id,
    u.nombre_usuario           AS usuario_nombre,
    ROUND(SUM((t.fecha_fin_estimada - t.fecha_inicio) * 1), 2) AS horas
  FROM tarea t
  JOIN usuario u ON t.id_desarrollador = u.id_usuario
  JOIN sprint s  ON t.id_sprint = s.id_sprint
  WHERE t.fecha_fin_estimada IS NOT NULL
    AND t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, TRUNC(s.fecha_inicio), TRUNC(s.fecha_fin_estimada),
           u.id_usuario, u.nombre_usuario
  ORDER BY s.id_sprint, u.id_usuario;
END;
/
-- ===========================================================
-- Horas reales por desarrollador y sprint
-- ===========================================================
CREATE OR REPLACE PROCEDURE KPI_HORAS_REALES_POR_DESA_SPRINT (
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
  SELECT
    s.id_sprint                AS sprint_id,
    TRUNC(s.fecha_inicio)      AS sprint_inicio,
    TRUNC(s.fecha_fin_estimada) AS sprint_fin,
    u.id_usuario               AS usuario_id,
    u.nombre_usuario           AS usuario_nombre,
    ROUND(SUM((NVL(t.fecha_fin_real, t.fecha_fin_estimada) - t.fecha_inicio) * 1), 2) AS horas
  FROM tarea t
  JOIN usuario u ON t.id_desarrollador = u.id_usuario
  JOIN sprint s  ON t.id_sprint = s.id_sprint
  WHERE t.fecha_inicio IS NOT NULL
  GROUP BY s.id_sprint, TRUNC(s.fecha_inicio), TRUNC(s.fecha_fin_estimada),
           u.id_usuario, u.nombre_usuario
  ORDER BY s.id_sprint, u.id_usuario;
END;
/

