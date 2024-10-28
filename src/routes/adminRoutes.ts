import { Router } from 'express';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import {
    getAdminListController,
    getAdminsByCPFController,
    getAdminsByNameController,
    getDoctorsByExamNameController
} from "../controllers/adminController";
import {tenantMiddleware} from "../middlewares/tenantMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.get('/', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminListController);
router.get('/cpf', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByCPFController);
router.get('/name', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByNameController);
router.get('/exam', tenantMiddleware, authMiddleware, isAdminMiddleware, getDoctorsByExamNameController)

export default router;