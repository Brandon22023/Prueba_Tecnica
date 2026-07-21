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

export function createEmployeeService({
  poolInstance = pool,
  repository = {
    findAll,
    findById,
    insert,
    update,
    deactivate,
    findAuditByEmployee
  },
  validators = {
    validateCreateEmployee,
    validateUpdateEmployee,
    validateEmployeeDates
  }
} = {}) {
  return {
    listEmployees(filters) {
      return repository.findAll(poolInstance, filters);
    },

    getEmployee(id) {
      return repository.findById(poolInstance, id);
    },

    async createEmployee(data, user) {
      const employee = validators.validateCreateEmployee(data);
      const connection = await poolInstance.getConnection();

      try {
        await connection.beginTransaction();
        await setAuditUser(connection, user);
        const created = await repository.insert(connection, employee);
        await connection.commit();
        return created;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async updateEmployee(id, data, user) {
      const patch = validators.validateUpdateEmployee(data);
      const connection = await poolInstance.getConnection();

      try {
        const current = await repository.findById(connection, id);
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

        validators.validateEmployeeDates(employee);

        await connection.beginTransaction();
        await setAuditUser(connection, user);
        const updated = await repository.update(connection, id, employee);
        await connection.commit();
        return updated;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async getEmployeeAudit(id) {
      const employee = await repository.findById(poolInstance, id);
      if (!employee) return null;
      return repository.findAuditByEmployee(poolInstance, id);
    },

    async deactivateEmployee(id, user) {
      const connection = await poolInstance.getConnection();

      try {
        await connection.beginTransaction();
        await setAuditUser(connection, user);
        const deactivated = await repository.deactivate(connection, id);
        await connection.commit();
        return deactivated;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }
  };
}

const defaultService = createEmployeeService();

export const listEmployees = defaultService.listEmployees;
export const getEmployee = defaultService.getEmployee;
export const createEmployee = defaultService.createEmployee;
export const updateEmployee = defaultService.updateEmployee;
export const getEmployeeAudit = defaultService.getEmployeeAudit;
export const deactivateEmployee = defaultService.deactivateEmployee;
