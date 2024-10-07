import { Router } from 'express';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import {
    getAdminListController,
    getAdminsByCPFController,
    getAdminsByNameController
} from "../controllers/adminController";
import {tenantMiddleware} from "../middlewares/tenantMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get('/admin', tenantMiddleware, getAdminListController);
router.get('/admin/cpf', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByCPFController);
router.get('/admin/name', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByNameController);

export default router;