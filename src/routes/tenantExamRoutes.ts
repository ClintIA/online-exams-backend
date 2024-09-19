import { Router } from 'express';
import { createExamController, getExamsController, updateExamController, deleteExamController } from '../controllers/tenantExamController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();

router.post('/', tenantMiddleware, authMiddleware, isAdminMiddleware, createExamController);
router.get('/', tenantMiddleware, authMiddleware, isAdminMiddleware, getExamsController);
router.put('/:clinicExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, updateExamController);
router.delete('/:clinicExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, deleteExamController);

export default router;
