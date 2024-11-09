import { Router } from 'express';
import { loginAdminController, loginPatientController } from '../../controllers/authController';
const router = Router();

router.post('/login/admin', loginAdminController);
router.post('/login/patient', loginPatientController);

export default router;
