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