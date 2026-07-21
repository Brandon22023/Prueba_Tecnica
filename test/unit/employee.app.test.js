import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';

import express from 'express';

import app, { createApp } from '../../src/main/app.js';
import { createEmployeeRouter } from '../../src/routes/employee.routes.js';
import { ValidationError } from '../../src/models/employee.model.js';

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, () => resolve(server.address().port));
  });
}

test('health responde ok con el app real', async () => {
  const server = createServer(app);
  const port = await listen(server);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('createApp maneja ValidationError con status 400', async () => {
  const router = express.Router();
  router.get('/boom', () => {
    throw new ValidationError('Datos inválidos', ['campo requerido']);
  });

  const testApp = createApp({ employeeRouter: router });
  const server = createServer(testApp);
  const port = await listen(server);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/empleados/boom`);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      message: 'Datos inválidos',
      details: ['campo requerido']
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('createEmployeeRouter monta los handlers correctos', async () => {
  const calls = [];
  const controller = {
    list: async (_request, response) => {
      calls.push('list');
      response.json({ endpoint: 'list' });
    },
    auditById: async (_request, response) => {
      calls.push('audit');
      response.json({ endpoint: 'audit' });
    },
    getById: async (_request, response) => {
      calls.push('get');
      response.json({ endpoint: 'get' });
    },
    create: async (_request, response) => {
      calls.push('create');
      response.status(201).json({ endpoint: 'create' });
    },
    updateById: async (_request, response) => {
      calls.push('update');
      response.json({ endpoint: 'update' });
    },
    deactivateById: async (_request, response) => {
      calls.push('deactivate');
      response.json({ endpoint: 'deactivate' });
    }
  };

  const router = createEmployeeRouter(controller);
  const testApp = createApp({ employeeRouter: router });
  const server = createServer(testApp);
  const port = await listen(server);

  try {
    const listResponse = await fetch(`http://127.0.0.1:${port}/api/empleados`);
    const getResponse = await fetch(`http://127.0.0.1:${port}/api/empleados/7`);

    assert.equal(listResponse.status, 200);
    assert.deepEqual(await listResponse.json(), { endpoint: 'list' });
    assert.equal(getResponse.status, 200);
    assert.deepEqual(await getResponse.json(), { endpoint: 'get' });
    assert.deepEqual(calls, ['list', 'get']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
