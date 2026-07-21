import test from 'node:test';
import assert from 'node:assert/strict';

import { createEmployeeController } from '../../src/controllers/employee.controller.js';
import { createMockResponse } from '../support/shared-utils.js';

test('list valida filtros y los envía al servicio', async () => {
  let receivedFilters;
  const controller = createEmployeeController({
    listEmployees: async (filters) => {
      receivedFilters = filters;
      return { data: [] };
    },
    getEmployee: async () => null,
    getEmployeeAudit: async () => null,
    createEmployee: async () => null,
    updateEmployee: async () => null,
    deactivateEmployee: async () => null
  });

  const response = createMockResponse();
  await controller.list({ query: { page: '2', limit: '5', apellido: '  Lopez ', activo: 'true' } }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(receivedFilters, {
    apellido: 'Lopez',
    activo: true,
    page: 2,
    limit: 5
  });
});

test('getById responde 404 cuando no existe', async () => {
  const controller = createEmployeeController({
    listEmployees: async () => ({}),
    getEmployee: async () => null,
    getEmployeeAudit: async () => null,
    createEmployee: async () => null,
    updateEmployee: async () => null,
    deactivateEmployee: async () => null
  });

  const response = createMockResponse();
  await controller.getById({ params: { id: '10' } }, response);

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.jsonBody, { message: 'Empleado no encontrado' });
});

test('create usa el usuario de auditoría por defecto', async () => {
  let receivedUser;
  const controller = createEmployeeController({
    listEmployees: async () => ({}),
    getEmployee: async () => null,
    getEmployeeAudit: async () => null,
    createEmployee: async (_body, user) => {
      receivedUser = user;
      return { ID_EMPLEADO: 1 };
    },
    updateEmployee: async () => null,
    deactivateEmployee: async () => null
  });

  const response = createMockResponse();
  await controller.create({ body: { nombres: 'Ana' }, get: () => null }, response);

  assert.equal(response.statusCode, 201);
  assert.equal(receivedUser, 'node-api');
});

test('updateById rechaza identificadores inválidos', async () => {
  const controller = createEmployeeController({
    listEmployees: async () => ({}),
    getEmployee: async () => null,
    getEmployeeAudit: async () => null,
    createEmployee: async () => null,
    updateEmployee: async () => null,
    deactivateEmployee: async () => null
  });

  const response = createMockResponse();

  await assert.rejects(
    () => controller.updateById({ params: { id: '0' }, body: {}, get: () => null }, response),
    /entero positivo/
  );
});
