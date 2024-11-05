import { Router } from 'express';
import { registerPatientController, registerAdminController, loginAdminController, loginPatientController } from '../../controllers/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';

const router = Router();

router.post('/login/admin', loginAdminController);
router.post('/login/patient', loginPatientController);

export default router;
