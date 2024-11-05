import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';
import { createPatientExamController, listPatientExamsController, updatePatientExamController, deletePatientExamController } from '../../controllers/patientExamController';
import {patientMiddleware} from "../../middlewares/patientMiddleware";

const router = Router();

router.get('/exams', authMiddleware, patientMiddleware, listPatientExamsController);

export default router;
