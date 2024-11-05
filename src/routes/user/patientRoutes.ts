import { Router } from 'express';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { findPatientByCPF, listPatients} from "../../controllers/patientController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {isAdminMiddleware} from "../../middlewares/isAdminMiddleware";
import {patientMiddleware} from "../../middlewares/patientMiddleware";

const router = Router();

router.get('/cpf', authMiddleware, patientMiddleware, findPatientByCPF);

export default router;
