#•	Obtener el salario actual de cada empleado.
SELECT e.NOMBRES, e.APELLIDOS, me.SALARIO 
FROM MOVIMIENTOS_EMPLEADOS me
INNER JOIN  EMPLEADO e 
 ON me.ID_EMPLEADO = e.ID_EMPLEADO
where me.SALARIO iS NOT null;

-- • Obtener el histórico de salarios de un empleado.
SELECT e.NOMBRES, e.APELLIDOS, hs.FECHA_INICIO, hs.FECHA_FIN, hs.SALARIO as historial_salario
FROM MOVIMIENTOS_EMPLEADOS me
INNER JOIN  EMPLEADO e 
 ON me.ID_EMPLEADO = e.ID_EMPLEADO
INNER JOIN  HISTORIAL_SALARIOS hs
 on e.ID_EMPLEADO = hs.ID_EMPLEADO
where hs.FECHA_FIN IS  NOT NULL;

-- •	Promedio salarial por departamento y mes considerando únicamente empleados activos.

SELECT d.ID_DEPARTAMENTO, d.NOMBRE AS DEPARTAMENTO, DATE_FORMAT(me.FECHA_MOVIMIENTO, '%Y-%m') AS MES,
    AVG(me.SALARIO) AS PROMEDIO_SALARIAL
FROM DEPARTAMENTO d
INNER JOIN MOVIMIENTOS_EMPLEADOS me
    ON d.ID_DEPARTAMENTO = me.ID_DEPARTAMENTO
INNER JOIN EMPLEADO e
    ON me.ID_EMPLEADO = e.ID_EMPLEADO
WHERE e.ACTIVO = TRUE
GROUP BY
    d.ID_DEPARTAMENTO,
    d.NOMBRE,
    DATE_FORMAT(me.FECHA_MOVIMIENTO, '%Y-%m')
ORDER BY
    MES,
    d.NOMBRE;

    
-- •	Detectar empleados con más de tres cambios de departamento en los últimos 24 meses.
SELECT
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS,
    COUNT(*) AS CAMBIOS_DEPARTAMENTO
FROM MOVIMIENTOS_EMPLEADOS me
INNER JOIN EMPLEADO e
    ON me.ID_EMPLEADO = e.ID_EMPLEADO
WHERE me.TIPO_MOVIMIENTO = 'DEPARTAMENTO'
  AND me.FECHA_MOVIMIENTO >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
GROUP BY
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS
HAVING COUNT(*) > 3;

-- •	Implementar una función en SQL o en el lenguaje seleccionado que realice un Forward Fill del salario utilizando el último salario conocido cuando existan valores nulos.

WITH movimientos AS (
    SELECT
        me.*,
        MAX(
            CASE
                WHEN me.TIPO_MOVIMIENTO = 'SALARIO'
                     AND me.SALARIO IS NOT NULL
                THEN me.FECHA_MOVIMIENTO
            END
        ) OVER (
            PARTITION BY me.ID_EMPLEADO
            ORDER BY
                me.FECHA_MOVIMIENTO,
                CASE
                    WHEN me.TIPO_MOVIMIENTO = 'SALARIO' THEN 0
                    ELSE 1
                END,
                me.ID_MOVIMIENTO
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS ULTIMA_FECHA_SALARIO
    FROM MOVIMIENTOS_EMPLEADOS me
)
SELECT
    m.ID_EMPLEADO,
    m.FECHA_MOVIMIENTO,
    m.TIPO_MOVIMIENTO,
    m.SALARIO,
    COALESCE(m.SALARIO, s.SALARIO) AS SALARIO_FORWARD_FILL
FROM movimientos m
LEFT JOIN MOVIMIENTOS_EMPLEADOS s
    ON s.ID_EMPLEADO = m.ID_EMPLEADO
    AND s.FECHA_MOVIMIENTO = m.ULTIMA_FECHA_SALARIO
    AND s.TIPO_MOVIMIENTO = 'SALARIO'
ORDER BY
    m.ID_EMPLEADO,
    m.FECHA_MOVIMIENTO;



# otras consultas
-- •	Empleados activos con los salarios más altos.
WITH salarios_actuales AS (
    SELECT
        hs.ID_EMPLEADO,
        hs.SALARIO
    FROM HISTORIAL_SALARIOS hs
    INNER JOIN EMPLEADO e
        ON e.ID_EMPLEADO = hs.ID_EMPLEADO
    WHERE hs.FECHA_FIN IS NULL
      AND e.ACTIVO = TRUE
)
SELECT
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS,
    sa.SALARIO
FROM salarios_actuales sa
INNER JOIN EMPLEADO e
    ON e.ID_EMPLEADO = sa.ID_EMPLEADO
WHERE sa.SALARIO = (
    SELECT MAX(SALARIO)
    FROM salarios_actuales
);
-- •	Listado de empleados
    -- o	Ordenar por
    -- 	Apellidos DESC 
    -- 	Nombres ASC 
SELECT
    ID_EMPLEADO,
    NOMBRES,
    APELLIDOS,
    DPI,
    CORREO,
    ACTIVO
FROM EMPLEADO
ORDER BY
    APELLIDOS DESC,
    NOMBRES ASC;

-- •	Listado de empleados por departamento.
SELECT
    COALESCE(d.NOMBRE, 'Sin departamento') AS DEPARTAMENTO,
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS
FROM EMPLEADO e
LEFT JOIN VW_EMPLEADO_DEPARTAMENTO_ACTUAL hd
    ON hd.ID_EMPLEADO = e.ID_EMPLEADO
LEFT JOIN UNIDAD_OPERATIVA uo
    ON uo.ID_UNIDAD_OPERATIVA = hd.ID_UNIDAD_OPERATIVA
LEFT JOIN UNIDAD_FUNCIONAL uf
    ON uf.ID_UNIDAD_FUNCIONAL = uo.ID_UNIDAD_FUNCIONAL
LEFT JOIN DEPARTAMENTO d
    ON d.ID_DEPARTAMENTO = uf.ID_DEPARTAMENTO
ORDER BY
    d.NOMBRE,
    e.APELLIDOS,
    e.NOMBRES;
-- •	Promedio salarial de los últimos doce meses para los empleados con menor salario actual.
WITH salarios_actuales AS (
    SELECT
        hs.ID_EMPLEADO,
        hs.SALARIO
    FROM HISTORIAL_SALARIOS hs
    INNER JOIN EMPLEADO e
        ON e.ID_EMPLEADO = hs.ID_EMPLEADO
    WHERE hs.FECHA_FIN IS NULL
      AND e.ACTIVO = TRUE
),
empleados_menor_salario AS (
    SELECT
        ID_EMPLEADO,
        SALARIO
    FROM salarios_actuales
    WHERE SALARIO = (
        SELECT MIN(SALARIO)
        FROM salarios_actuales
    )
)
SELECT
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS,
    ems.SALARIO AS SALARIO_ACTUAL,
    AVG(hs.SALARIO) AS PROMEDIO_ULTIMOS_12_MESES
FROM empleados_menor_salario ems
INNER JOIN EMPLEADO e
    ON e.ID_EMPLEADO = ems.ID_EMPLEADO
INNER JOIN HISTORIAL_SALARIOS hs
    ON hs.ID_EMPLEADO = ems.ID_EMPLEADO
WHERE hs.FECHA_INICIO <= CURDATE()
  AND (
      hs.FECHA_FIN IS NULL
      OR hs.FECHA_FIN >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  )
GROUP BY
    e.ID_EMPLEADO,
    e.NOMBRES,
    e.APELLIDOS,
    ems.SALARIO;
-- •	Mostrar
    -- o	Departamento 
    -- o	Jefe del departamento 
    -- o	Empleados pertenecientes 

SELECT
    d.NOMBRE AS DEPARTAMENTO,
    CONCAT_WS(' ', j.NOMBRES, j.APELLIDOS) AS JEFE_DEPARTAMENTO,
    CONCAT_WS(' ', e.NOMBRES, e.APELLIDOS) AS EMPLEADO
FROM DEPARTAMENTO d
LEFT JOIN EMPLEADO j
    ON j.ID_EMPLEADO = d.ID_JEFE
LEFT JOIN UNIDAD_FUNCIONAL uf
    ON uf.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
LEFT JOIN UNIDAD_OPERATIVA uo
    ON uo.ID_UNIDAD_FUNCIONAL = uf.ID_UNIDAD_FUNCIONAL
LEFT JOIN VW_EMPLEADO_DEPARTAMENTO_ACTUAL hd
    ON hd.ID_UNIDAD_OPERATIVA = uo.ID_UNIDAD_OPERATIVA
LEFT JOIN EMPLEADO e
    ON e.ID_EMPLEADO = hd.ID_EMPLEADO
ORDER BY
    d.NOMBRE,
    e.APELLIDOS,
    e.NOMBRES;
