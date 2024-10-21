import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import { findPatientByCPFAndTenant, listPatients} from "../controllers/patientController";

const router = Router();

router.get('/', tenantMiddleware, listPatients);
router.post('/cpf', tenantMiddleware,findPatientByCPFAndTenant);


export default router;
