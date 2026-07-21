const employeeColumns = `
  ID_EMPLEADO, NOMBRES, APELLIDOS, DPI, NIT, FECHA_NACIMIENTO,
  FECHA_INGRESO, CORREO, TELEFONO, DIRECCION, ACTIVO, FECHA_BAJA,
  FECHA_CREACION, FECHA_ACTUALIZACION
`;

export async function findAll(connection, filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.apellido) {
    conditions.push('APELLIDOS LIKE ?');
    values.push(`%${filters.apellido}%`);
  }

  if (filters.activo !== undefined) {
    conditions.push('ACTIVO = ?');
    values.push(filters.activo ? 1 : 0);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const page = Number.isInteger(filters.page) && filters.page > 0 ? filters.page : 1;
  const limit = Number.isInteger(filters.limit) && filters.limit > 0 ? filters.limit : 10;
  const offset = (page - 1) * limit;

  const [rows] = await connection.execute(`
    SELECT ${employeeColumns}
    FROM EMPLEADO
    ${where}
    ORDER BY APELLIDOS DESC, NOMBRES ASC
    LIMIT ${limit} OFFSET ${offset}
  `, values);

  const [countRows] = await connection.execute(
    `SELECT COUNT(*) AS total FROM EMPLEADO ${where}`,
    values
  );

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit)
    }
  };
}

export async function findAuditByEmployee(connection, id) {
  const [rows] = await connection.execute(`
    SELECT
      ID_BITACORA,
      TABLA_AFECTADA,
      ID_REGISTRO_AFECTADO,
      OPERACION,
      USUARIO,
      FECHA_OPERACION,
      VALORES_ANTERIORES,
      VALORES_NUEVOS
    FROM BITACORA_AUDITORIA
    WHERE TABLA_AFECTADA = 'EMPLEADO'
      AND ID_REGISTRO_AFECTADO = ?
    ORDER BY FECHA_OPERACION DESC, ID_BITACORA DESC
  `, [id]);
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
