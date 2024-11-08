import { Router } from 'express';
import { findPatientByCPF} from "../../controllers/patientController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {patientMiddleware} from "../../middlewares/patientMiddleware";

const router = Router();

router.get('/cpf', authMiddleware, patientMiddleware, findPatientByCPF);

export default router;
