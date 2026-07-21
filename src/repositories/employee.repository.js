const employeeColumns = `
  ID_EMPLEADO, NOMBRES, APELLIDOS, DPI, NIT, FECHA_NACIMIENTO,
  FECHA_INGRESO, CORREO, TELEFONO, DIRECCION, ACTIVO, FECHA_BAJA,
  FECHA_CREACION, FECHA_ACTUALIZACION
`;

export async function findAll(connection) {
  const [rows] = await connection.query(`
    SELECT ${employeeColumns}
    FROM EMPLEADO
    ORDER BY APELLIDOS DESC, NOMBRES ASC
  `);
  return rows;
}

export async function findById(connection, id) {
  const [rows] = await connection.execute(
    `SELECT ${employeeColumns} FROM EMPLEADO WHERE ID_EMPLEADO = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function insert(connection, employee) {
  const [result] = await connection.execute(`
    INSERT INTO EMPLEADO (
      NOMBRES, APELLIDOS, DPI, NIT, FECHA_NACIMIENTO, FECHA_INGRESO,
      CORREO, TELEFONO, DIRECCION
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    employee.nombres,
    employee.apellidos,
    employee.dpi,
    employee.nit ?? null,
    employee.fechaNacimiento,
    employee.fechaIngreso,
    employee.correo ?? null,
    employee.telefono ?? null,
    employee.direccion ?? null
  ]);
  return findById(connection, result.insertId);
}

export async function update(connection, id, employee) {
  const [result] = await connection.execute(`
    UPDATE EMPLEADO
    SET NOMBRES = ?,
        APELLIDOS = ?,
        DPI = ?,
        NIT = ?,
        FECHA_NACIMIENTO = ?,
        FECHA_INGRESO = ?,
        CORREO = ?,
        TELEFONO = ?,
        DIRECCION = ?
    WHERE ID_EMPLEADO = ?
  `, [
    employee.nombres,
    employee.apellidos,
    employee.dpi,
    employee.nit ?? null,
    employee.fechaNacimiento,
    employee.fechaIngreso,
    employee.correo ?? null,
    employee.telefono ?? null,
    employee.direccion ?? null,
    id
  ]);

  return result.affectedRows === 0 ? null : findById(connection, id);
}

export async function deactivate(connection, id) {
  const [result] = await connection.execute(`
    UPDATE EMPLEADO
    SET ACTIVO = FALSE,
        FECHA_BAJA = COALESCE(FECHA_BAJA, CURDATE())
    WHERE ID_EMPLEADO = ?
      AND ACTIVO = TRUE
  `, [id]);

  return result.affectedRows === 0 ? null : findById(connection, id);
}
