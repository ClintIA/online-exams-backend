import { Router } from 'express';
import { createExamController, getExamsController, updateExamController, deleteExamController } from '../controllers/examController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();

router.post('/create', tenantMiddleware, authMiddleware, isAdminMiddleware, createExamController);
router.get('/', tenantMiddleware, authMiddleware, getExamsController);
router.put('/update/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, updateExamController);
router.delete('/delete/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, deleteExamController);

export default router;
