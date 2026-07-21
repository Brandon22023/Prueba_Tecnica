import { Router } from 'express';
import {
  list,
  getById,
  auditById,
  create,
  updateById,
  deactivateById
} from '../controllers/employee.controller.js';

const router = Router();

router.get('/', list);
router.get('/:id/auditoria', auditById);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', updateById);
router.patch('/:id/baja', deactivateById);

export default router;
