import {
  createEmployeeService,
  listEmployees,
  getEmployee,
  getEmployeeAudit,
  createEmployee,
  updateEmployee,
  deactivateEmployee
} from '../services/employee.service.js';

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('El identificador del empleado debe ser un entero positivo');
    error.statusCode = 400;
    throw error;
  }
  return id;
}

function auditUser(request) {
  return request.get('x-audit-user') || 'node-api';
}

export function createEmployeeController(service = createEmployeeService()) {
  return {
    async list(request, response) {
      const { query } = request;
      const page = Number(query.page ?? 1);
      const limit = Number(query.limit ?? 10);

      if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return response.status(400).json({ message: 'page debe ser >= 1 y limit debe estar entre 1 y 100' });
      }

      let activo;
      if (query.activo !== undefined) {
        if (!['true', 'false'].includes(String(query.activo).toLowerCase())) {
          return response.status(400).json({ message: 'activo debe ser true o false' });
        }
        activo = String(query.activo).toLowerCase() === 'true';
      }

      return response.json(await service.listEmployees({
        apellido: query.apellido?.trim(),
        activo,
        page,
        limit
      }));
    },

    async auditById(request, response) {
      const audit = await service.getEmployeeAudit(parseId(request.params.id));
      if (!audit) return response.status(404).json({ message: 'Empleado no encontrado' });
      return response.json(audit);
    },

    async getById(request, response) {
      const employee = await service.getEmployee(parseId(request.params.id));
      if (!employee) return response.status(404).json({ message: 'Empleado no encontrado' });
      return response.json(employee);
    },

    async create(request, response) {
      const employee = await service.createEmployee(request.body, auditUser(request));
      return response.status(201).json(employee);
    },

    async updateById(request, response) {
      const employee = await service.updateEmployee(parseId(request.params.id), request.body, auditUser(request));
      if (!employee) return response.status(404).json({ message: 'Empleado no encontrado' });
      return response.json(employee);
    },

    async deactivateById(request, response) {
      const employee = await service.deactivateEmployee(parseId(request.params.id), auditUser(request));
      if (!employee) return response.status(404).json({ message: 'Empleado no encontrado o ya está inactivo' });
      return response.json(employee);
    }
  };
}

const defaultController = createEmployeeController();

export const list = defaultController.list;
export const auditById = defaultController.auditById;
export const getById = defaultController.getById;
export const create = defaultController.create;
export const updateById = defaultController.updateById;
export const deactivateById = defaultController.deactivateById;
