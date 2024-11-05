import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';
import { createPatientExamController, listPatientExamsController, updatePatientExamController, deletePatientExamController } from '../../controllers/patientExamController';

const router = Router();
/**
 * @swagger
 * /example:
 *   POST:
 *     summary: Create a Patient Exam
 *     responses:
 *       200:
 *         description: Booking a exam to a patient.
 */
router.post('/patientexams', tenantMiddleware, authMiddleware, isAdminMiddleware, createPatientExamController);
/**
 * @swagger
 * /example:
 *   GET:
 *     summary: Returns a list with all exams or with filters
 *     responses:
 *       200:
 *         description: List of exams. Filters: Date, CPF, Name, Status, Tenant ID and Patient ID
 */
router.get('/patientexams', authMiddleware, tenantMiddleware, isAdminMiddleware, listPatientExamsController);
router.put('/patientexams/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, updatePatientExamController);
router.delete('/patientexams/:patientExamId', tenantMiddleware, authMiddleware, isAdminMiddleware, deletePatientExamController);


export default router;
