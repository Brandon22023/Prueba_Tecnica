import test from 'node:test';
import assert from 'node:assert/strict';

import { createEmployeeService } from '../../src/services/employee.service.js';
import { ValidationError } from '../../src/models/employee.model.js';
import { createConnectionStub } from '../support/shared-utils.js';

test('createEmployee valida, inicia transacción y confirma cambios', async () => {
  const events = [];
  const connection = createConnectionStub({
    execute: async (sql, params) => {
      events.push({ type: 'execute', sql, params });
      return [[], []];
    },
    beginTransaction: async () => events.push({ type: 'begin' }),
    commit: async () => events.push({ type: 'commit' }),
    rollback: async () => events.push({ type: 'rollback' }),
    release: () => events.push({ type: 'release' })
  });

  const poolInstance = {
    async getConnection() {
      events.push({ type: 'getConnection' });
      return connection;
    }
  };

  const service = createEmployeeService({
    poolInstance,
    repository: {
      findAll: async () => ({}),
      findById: async () => null,
      insert: async () => {
        events.push({ type: 'insert' });
        return { ID_EMPLEADO: 1 };
      },
      update: async () => null,
      deactivate: async () => null,
      findAuditByEmployee: async () => []
    },
    validators: {
      validateCreateEmployee: (data) => data,
      validateUpdateEmployee: (data) => data,
      validateEmployeeDates: () => {}
    }
  });

  const created = await service.createEmployee({ nombres: 'Ana' }, '  auditor  ');

  assert.deepEqual(created, { ID_EMPLEADO: 1 });
  assert.deepEqual(events.map((event) => event.type), [
    'getConnection',
    'begin',
    'execute',
    'insert',
    'commit',
    'release'
  ]);
  assert.equal(events[2].params[0], 'auditor');
});

test('updateEmployee combina el estado actual con el patch', async () => {
  const connection = createConnectionStub({
    execute: async (sql, params) => {
      if (sql.includes('SET @usuario_app')) {
        return [[], []];
      }
      if (sql.includes('SELECT')) {
        return [[{
          NOMBRES: 'Ana',
          APELLIDOS: 'Lopez',
          DPI: '123',
          NIT: 'NIT1',
          FECHA_NACIMIENTO: '1990-01-01',
          FECHA_INGRESO: '2020-01-01',
          CORREO: 'ana@example.com',
          TELEFONO: '555',
          DIRECCION: 'calle 1'
        }]];
      }
      if (sql.includes('UPDATE EMPLEADO')) {
        assert.equal(params[1], 'Lopez');
        assert.equal(params[4], '1990-01-01');
        return [[{ ID_EMPLEADO: 1, NOMBRES: 'Ana' }]];
      }
      return [[{ ID_EMPLEADO: 1 }]];
    },
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {}
  });

  const service = createEmployeeService({
    poolInstance: {
      async getConnection() {
        return connection;
      }
    },
    repository: {
      findAll: async () => ({}),
      findById: async () => ({
        NOMBRES: 'Ana',
        APELLIDOS: 'Lopez',
        DPI: '123',
        NIT: 'NIT1',
        FECHA_NACIMIENTO: '1990-01-01',
        FECHA_INGRESO: '2020-01-01',
        CORREO: 'ana@example.com',
        TELEFONO: '555',
        DIRECCION: 'calle 1'
      }),
      insert: async () => null,
      update: async () => ({ ID_EMPLEADO: 1, NOMBRES: 'Ana' }),
      deactivate: async () => null,
      findAuditByEmployee: async () => []
    },
    validators: {
      validateCreateEmployee: (data) => data,
      validateUpdateEmployee: (data) => data,
      validateEmployeeDates: (data) => {
        assert.equal(data.apellidos, 'Lopez');
      }
    }
  });

  const updated = await service.updateEmployee(1, { apellidos: 'Lopez' }, 'auditor');

  assert.deepEqual(updated, { ID_EMPLEADO: 1, NOMBRES: 'Ana' });
});

test('getEmployeeAudit retorna null cuando no existe el empleado', async () => {
  const service = createEmployeeService({
    poolInstance: {},
    repository: {
      findAll: async () => ({}),
      findById: async () => null,
      insert: async () => null,
      update: async () => null,
      deactivate: async () => null,
      findAuditByEmployee: async () => []
    },
    validators: {
      validateCreateEmployee: (data) => data,
      validateUpdateEmployee: (data) => data,
      validateEmployeeDates: () => {}
    }
  });

  assert.equal(await service.getEmployeeAudit(999), null);
});

test('deactivateEmployee revierte la transacción si el repositorio falla', async () => {
  const events = [];
  const connection = createConnectionStub({
    execute: async (sql) => {
      events.push({ type: 'execute', sql });
      if (sql.includes('SET @usuario_app')) {
        return [[], []];
      }
      throw new Error('fallo');
    },
    beginTransaction: async () => events.push({ type: 'begin' }),
    commit: async () => events.push({ type: 'commit' }),
    rollback: async () => events.push({ type: 'rollback' }),
    release: () => events.push({ type: 'release' })
  });

  const service = createEmployeeService({
    poolInstance: {
      async getConnection() {
        return connection;
      }
    },
    repository: {
      findAll: async () => ({}),
      findById: async () => null,
      insert: async () => null,
      update: async () => null,
      deactivate: async () => { throw new Error('fallo'); },
      findAuditByEmployee: async () => []
    },
    validators: {
      validateCreateEmployee: (data) => data,
      validateUpdateEmployee: (data) => data,
      validateEmployeeDates: () => {}
    }
  });

  await assert.rejects(() => service.deactivateEmployee(1, 'auditor'), /fallo/);
  assert.deepEqual(events.map((event) => event.type), ['begin', 'execute', 'rollback', 'release']);
});
