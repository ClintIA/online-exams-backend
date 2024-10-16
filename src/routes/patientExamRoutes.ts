import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { createPatientExamController, listPatientExamsController, updatePatientExamController, deletePatientExamController } from '../controllers/patientExamController';

const router = Router();

router.post('/', tenantMiddleware, authMiddleware, isAdminMiddleware, createPatientExamController);
router.get('/', authMiddleware, authMiddleware, listPatientExamsController);
router.put('/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, updatePatientExamController);
router.delete('/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, deletePatientExamController);

export default router;
