const requiredCreateFields = [
  'nombres',
  'apellidos',
  'dpi',
  'fechaNacimiento',
  'fechaIngreso'
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

function isValidDate(value) {
  return typeof value === 'string' && datePattern.test(value) && !Number.isNaN(Date.parse(value));
}

function validateCommon(data) {
  const errors = [];

  for (const field of requiredCreateFields) {
    if (data[field] === undefined || data[field] === null || String(data[field]).trim() === '') {
      errors.push(`${field} es obligatorio`);
    }
  }

  for (const field of ['fechaNacimiento', 'fechaIngreso']) {
    if (data[field] !== undefined && !isValidDate(data[field])) {
      errors.push(`${field} debe tener formato YYYY-MM-DD`);
    }
  }

  if (data.correo && !emailPattern.test(data.correo)) {
    errors.push('correo no tiene un formato válido');
  }

  if (data.nombres && String(data.nombres).length > 100) errors.push('nombres no puede superar 100 caracteres');
  if (data.apellidos && String(data.apellidos).length > 100) errors.push('apellidos no puede superar 100 caracteres');
  if (data.dpi && String(data.dpi).length > 20) errors.push('dpi no puede superar 20 caracteres');

  if (errors.length > 0) throw new ValidationError('Datos de empleado inválidos', errors);
}

export function validateCreateEmployee(data) {
  validateCommon(data);
  validateDateOrder(data);
  return normalizeEmployee(data);
}

export function validateUpdateEmployee(data) {
  if (!data || Object.keys(data).length === 0) {
    throw new ValidationError('Debe enviar al menos un campo para modificar');
  }

  if (data.correo && !emailPattern.test(data.correo)) {
    throw new ValidationError('Datos de empleado inválidos', ['correo no tiene un formato válido']);
  }

  for (const field of ['fechaNacimiento', 'fechaIngreso']) {
    if (data[field] !== undefined && !isValidDate(data[field])) {
      throw new ValidationError('Datos de empleado inválidos', [`${field} debe tener formato YYYY-MM-DD`]);
    }
  }

  return normalizeEmployee(data);
}

export function validateEmployeeDates(data) {
  validateDateOrder(data);
}

function validateDateOrder(data) {
  if (
    data.fechaNacimiento &&
    data.fechaIngreso &&
    isValidDate(data.fechaNacimiento) &&
    isValidDate(data.fechaIngreso) &&
    data.fechaNacimiento >= data.fechaIngreso
  ) {
    throw new ValidationError(
      'Fechas de empleado inválidas',
      ['fechaNacimiento debe ser anterior a fechaIngreso']
    );
  }
}

function normalizeEmployee(data) {
  const normalized = {};
  for (const [key, value] of Object.entries(data)) {
    normalized[key] = typeof value === 'string' ? value.trim() : value;
  }
  return normalized;
}
