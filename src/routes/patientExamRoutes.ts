import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { createPatientExamController, listPatientExamsController, updatePatientExamController, deletePatientExamController } from '../controllers/patientExamController';

const router = Router();

router.post('/', tenantMiddleware, authMiddleware, isAdminMiddleware, createPatientExamController);
router.get('/', tenantMiddleware, listPatientExamsController);
router.put('/:examId', tenantMiddleware, updatePatientExamController);
router.delete('/:examId', tenantMiddleware, authMiddleware, isAdminMiddleware, deletePatientExamController);


export default router;
