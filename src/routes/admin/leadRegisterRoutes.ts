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

router.post('/',authMiddleware, isAdminMiddleware, tenantMiddleware,  createLeadRegisterController);
router.get('/',authMiddleware, isAdminMiddleware, tenantMiddleware,  getLeadRegistersController);
router.get('/search',authMiddleware, isAdminMiddleware, tenantMiddleware,  searchLeadRegistersController);
router.get('/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  getLeadRegisterByIdController);
router.put('/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  updateLeadRegisterController);
router.delete('/soft/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  softDeleteLeadRegisterController);
router.delete('/:id',authMiddleware, isAdminMiddleware, tenantMiddleware,  deleteLeadRegisterController);

export default router;