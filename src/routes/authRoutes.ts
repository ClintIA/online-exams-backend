import { Router } from 'express';
import { registerUserController, registerAdminController, loginAdminController, loginPatientController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();

router.post('/register/user', authMiddleware, isAdminMiddleware, registerUserController);
router.post('/register/admin', tenantMiddleware, authMiddleware, isAdminMiddleware, registerAdminController);
router.post('/login/admin', tenantMiddleware, loginAdminController);
router.post('/login/patient', tenantMiddleware, loginPatientController);

export default router;
