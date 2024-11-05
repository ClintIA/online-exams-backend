import { Router } from 'express';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { listPatients} from "../../controllers/patientController";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {isAdminMiddleware} from "../../middlewares/isAdminMiddleware";

const router = Router();

router.get('/patients', tenantMiddleware, authMiddleware, isAdminMiddleware, listPatients);

export default router;
