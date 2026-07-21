import express from 'express';
import employeeRoutes from '../routes/employee.routes.js';
import { ValidationError } from '../models/employee.model.js';

const app = express();

app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/empleados', employeeRoutes);

app.use((error, _request, response, _next) => {
  if (error instanceof ValidationError) {
    return response.status(400).json({ message: error.message, details: error.details });
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return response.status(409).json({ message: 'DPI o correo ya registrado' });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return response.status(400).json({ message: 'La referencia enviada no existe' });
  }

  console.error(error);
  return response.status(error.statusCode ?? 500).json({ message: 'Error interno del servidor' });
});

export default app;
