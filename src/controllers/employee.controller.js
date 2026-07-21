import {
  listEmployees,
  getEmployee,
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

export async function list(request, response) {
  response.json(await listEmployees());
}

export async function getById(request, response) {
  const employee = await getEmployee(parseId(request.params.id));
  if (!employee) return response.status(404).json({ message: 'Empleado no encontrado' });
  return response.json(employee);
}

export async function create(request, response) {
  const employee = await createEmployee(request.body, auditUser(request));
  return response.status(201).json(employee);
}

export async function updateById(request, response) {
  const employee = await updateEmployee(parseId(request.params.id), request.body, auditUser(request));
  if (!employee) return response.status(404).json({ message: 'Empleado no encontrado' });
  return response.json(employee);
}

export async function deactivateById(request, response) {
  const employee = await deactivateEmployee(parseId(request.params.id), auditUser(request));
  if (!employee) return response.status(404).json({ message: 'Empleado no encontrado o ya está inactivo' });
  return response.json(employee);
}
