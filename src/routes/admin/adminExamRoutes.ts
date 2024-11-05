import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';
import { createPatientExamController, listPatientExamsController, updatePatientExamController, deletePatientExamController } from '../../controllers/patientExamController';

const router = Router();
router.post('/patientexams', tenantMiddleware, authMiddleware, isAdminMiddleware, createPatientExamController);
router.get('/patientexams', authMiddleware, tenantMiddleware, isAdminMiddleware, listPatientExamsController);
router.put('/patientexams/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, updatePatientExamController);
router.delete('/patientexams/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, deletePatientExamController);


export default router;
