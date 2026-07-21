import pool from '../config/database.js';
import {
  findAll,
  findById,
  insert,
  update,
  deactivate,
  findAuditByEmployee
} from '../repositories/employee.repository.js';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeDates
} from '../models/employee.model.js';

function auditUser(value) {
  const user = String(value ?? 'node-api').trim();
  return user.slice(0, 100) || 'node-api';
}

async function setAuditUser(connection, user) {
  await connection.execute('SET @usuario_app = ?', [auditUser(user)]);
}

export function listEmployees(filters) {
  return findAll(pool, filters);
}

export function getEmployee(id) {
  return findById(pool, id);
}

export async function createEmployee(data, user) {
  const employee = validateCreateEmployee(data);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await setAuditUser(connection, user);
    const created = await insert(connection, employee);
    await connection.commit();
    return created;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateEmployee(id, data, user) {
  const patch = validateUpdateEmployee(data);
  const connection = await pool.getConnection();

  try {
    const current = await findById(connection, id);
    if (!current) return null;

    const employee = {
      nombres: patch.nombres ?? current.NOMBRES,
      apellidos: patch.apellidos ?? current.APELLIDOS,
      dpi: patch.dpi ?? current.DPI,
      nit: patch.nit ?? current.NIT,
      fechaNacimiento: patch.fechaNacimiento ?? current.FECHA_NACIMIENTO,
      fechaIngreso: patch.fechaIngreso ?? current.FECHA_INGRESO,
      correo: patch.correo ?? current.CORREO,
      telefono: patch.telefono ?? current.TELEFONO,
      direccion: patch.direccion ?? current.DIRECCION
    };

    validateEmployeeDates(employee);

    await connection.beginTransaction();
    await setAuditUser(connection, user);
    const updated = await update(connection, id, employee);
    await connection.commit();
    return updated;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getEmployeeAudit(id) {
  const employee = await findById(pool, id);
  if (!employee) return null;
  return findAuditByEmployee(pool, id);
}

export async function deactivateEmployee(id, user) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await setAuditUser(connection, user);
    const deactivated = await deactivate(connection, id);
    await connection.commit();
    return deactivated;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
