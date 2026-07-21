import 'dotenv/config';
import app from './app.js';
import { checkDatabase } from '../config/database.js';

const port = Number(process.env.PORT ?? 3000);

try {
  await checkDatabase();
  app.listen(port, () => {
    console.log(`API de empleados escuchando en http://localhost:${port}`);
  });
} catch (error) {
  console.error('No fue posible conectar con MySQL:', error.message);
  process.exit(1);
}
