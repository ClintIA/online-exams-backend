import { Router } from 'express';
import {
    createLeadRegisterController,
    getLeadRegistersController,
    getLeadRegisterByIdController,
    updateLeadRegisterController,
    softDeleteLeadRegisterController,
    deleteLeadRegisterController,
    searchLeadRegistersController
} from '../../controllers/leadRegisterController';
import {authMiddleware} from "../../middlewares/authMiddleware";
import {isAdminMiddleware} from "../../middlewares/isAdminMiddleware";
import {tenantMiddleware} from "../../middlewares/tenantMiddleware";

const router = Router();

router.post('/lead-register',authMiddleware, isAdminMiddleware, tenantMiddleware,  createLeadRegisterController);
router.get('/lead-register/',authMiddleware, isAdminMiddleware, tenantMiddleware,  getLeadRegistersController);
router.get('/lead-register/search',authMiddleware, isAdminMiddleware, tenantMiddleware,  searchLeadRegistersController);
router.get('/lead-register/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  getLeadRegisterByIdController);
router.put('/lead-register/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  updateLeadRegisterController);
router.delete('/lead-register/soft/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  softDeleteLeadRegisterController);
router.delete('/lead-register/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  deleteLeadRegisterController);

export default router;