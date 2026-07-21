import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ValidationError,
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeDates
} from '../../src/models/employee.model.js';

test('validateCreateEmployee normaliza texto y valida datos requeridos', () => {
  const employee = validateCreateEmployee({
    nombres: '  Ana  ',
    apellidos: '  Lopez ',
    dpi: '1234567890123',
    fechaNacimiento: '1990-01-01',
    fechaIngreso: '2020-01-01',
    correo: 'ana@example.com'
  });

  assert.deepEqual(employee, {
    nombres: 'Ana',
    apellidos: 'Lopez',
    dpi: '1234567890123',
    fechaNacimiento: '1990-01-01',
    fechaIngreso: '2020-01-01',
    correo: 'ana@example.com'
  });
});

test('validateCreateEmployee rechaza campos obligatorios faltantes', () => {
  assert.throws(
    () => validateCreateEmployee({ nombres: 'Ana' }),
    ValidationError
  );
});

test('validateUpdateEmployee rechaza payload vacío', () => {
  assert.throws(
    () => validateUpdateEmployee({}),
    ValidationError
  );
});

test('validateEmployeeDates rechaza fechaNacimiento posterior a fechaIngreso', () => {
  assert.throws(
    () => validateEmployeeDates({
      fechaNacimiento: '2024-01-01',
      fechaIngreso: '2023-01-01'
    }),
    ValidationError
  );
});
