import { Router } from 'express';
import { requestPasswordResetController, validateResetTokenController, resetPasswordController } from '../../controllers/resetPasswordController';

const router = Router();

router.post('/auth/password-reset/request', requestPasswordResetController);

router.post('/auth/password-reset/validate', validateResetTokenController);

router.post('/auth/password-reset/reset', resetPasswordController);

export default router;
