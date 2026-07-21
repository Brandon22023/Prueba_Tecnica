import test from 'node:test';
import assert from 'node:assert/strict';

import {
  findAll,
  findById,
  findAuditByEmployee,
  insert,
  update,
  deactivate
} from '../../src/repositories/employee.repository.js';

test('findAll arma filtros, paginación y conteo', async () => {
  const calls = [];
  const connection = {
    async execute(sql, params) {
      calls.push({ sql: sql.trim().replace(/\s+/g, ' '), params });
      if (sql.includes('COUNT(*)')) {
        return [[{ total: 2 }]];
      }
      return [[[{ ID_EMPLEADO: 1 }]]];
    }
  };

  const result = await findAll(connection, {
    apellido: 'Lopez',
    activo: true,
    page: 2,
    limit: 5
  });

  assert.equal(calls.length, 2);
  assert.match(calls[0].sql, /WHERE APELLIDOS LIKE \? AND ACTIVO = \?/);
  assert.deepEqual(calls[0].params, ['%Lopez%', 1]);
  assert.match(calls[1].sql, /SELECT COUNT\(\*\) AS total FROM EMPLEADO/);
  assert.deepEqual(result, {
    data: [[{ ID_EMPLEADO: 1 }]],
    pagination: {
      page: 2,
      limit: 5,
      total: 2,
      totalPages: 1
    }
  });
});

test('findById retorna el primer registro o null', async () => {
  const connection = {
    async execute(sql, params) {
      assert.match(sql, /WHERE ID_EMPLEADO = \?/);
      assert.deepEqual(params, [7]);
      return [[{ ID_EMPLEADO: 7 }]];
    }
  };

  assert.deepEqual(await findById(connection, 7), { ID_EMPLEADO: 7 });
});

test('findAuditByEmployee consulta la bitácora del empleado', async () => {
  const connection = {
    async execute(sql, params) {
      assert.match(sql, /FROM BITACORA_AUDITORIA/);
      assert.deepEqual(params, [3]);
      return [[{ ID_BITACORA: 10 }]];
    }
  };

  assert.deepEqual(await findAuditByEmployee(connection, 3), [{ ID_BITACORA: 10 }]);
});

test('insert inserta y busca el registro creado', async () => {
  const calls = [];
  const connection = {
    async execute(sql, params) {
      calls.push({ sql: sql.trim().replace(/\s+/g, ' '), params });
      if (sql.startsWith('\n    INSERT INTO EMPLEADO')) {
        return [[{ insertId: 9 }]];
      }
      return [[{ ID_EMPLEADO: 9 }]];
    }
  };

  const employee = await insert(connection, {
    nombres: 'Ana',
    apellidos: 'Lopez',
    dpi: '123',
    nit: null,
    fechaNacimiento: '1990-01-01',
    fechaIngreso: '2020-01-01',
    correo: 'ana@example.com',
    telefono: null,
    direccion: null
  });

  assert.equal(calls.length, 2);
  assert.match(calls[0].sql, /INSERT INTO EMPLEADO/);
  assert.deepEqual(employee, { ID_EMPLEADO: 9 });
});

test('update retorna null cuando no se afecta ninguna fila', async () => {
  const connection = {
    async execute(sql) {
      if (sql.includes('UPDATE EMPLEADO')) {
        return [{ affectedRows: 0 }];
      }
      return [[{ ID_EMPLEADO: 1 }]];
    }
  };

  assert.equal(
    await update(connection, 1, {
      nombres: 'Ana',
      apellidos: 'Lopez',
      dpi: '123',
      nit: null,
      fechaNacimiento: '1990-01-01',
      fechaIngreso: '2020-01-01',
      correo: null,
      telefono: null,
      direccion: null
    }),
    null
  );
});

test('deactivate desactiva y devuelve el registro actualizado', async () => {
  const connection = {
    async execute(sql) {
      if (sql.includes('UPDATE EMPLEADO')) {
        return [{ affectedRows: 1 }];
      }
      return [[{ ID_EMPLEADO: 4, ACTIVO: 0 }]];
    }
  };

  assert.deepEqual(await deactivate(connection, 4), { ID_EMPLEADO: 4, ACTIVO: 0 });
});
