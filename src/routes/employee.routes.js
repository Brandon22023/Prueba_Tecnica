import { Router } from 'express';
import {
  createEmployeeController,
  list,
  getById,
  auditById,
  create,
  updateById,
  deactivateById
} from '../controllers/employee.controller.js';

export function createEmployeeRouter(controller = createEmployeeController()) {
  const router = Router();

  router.get('/', controller.list ?? list);
  router.get('/:id/auditoria', controller.auditById ?? auditById);
  router.get('/:id', controller.getById ?? getById);
  router.post('/', controller.create ?? create);
  router.put('/:id', controller.updateById ?? updateById);
  router.patch('/:id/baja', controller.deactivateById ?? deactivateById);

  return router;
}

const router = createEmployeeRouter();

export default router;
