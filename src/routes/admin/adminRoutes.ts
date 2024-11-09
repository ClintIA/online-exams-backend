import { Router } from 'express';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';
import {
    deleteAdminController,
    getAdminListController,
    getAdminsByCPFController,
    getAdminsByNameController,
    getDoctorsByExamNameController, getDoctorsListController,
    updateAdminController
} from "../../controllers/adminController";
import {tenantMiddleware} from "../../middlewares/tenantMiddleware";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {registerAdminController, registerPatientController} from "../../controllers/authController";

const router = Router();

router.get('/', getAdminListController);
router.get('/cpf', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByCPFController);
router.get('/name', tenantMiddleware, authMiddleware, isAdminMiddleware, getAdminsByNameController);
router.get('/exam', tenantMiddleware, authMiddleware, isAdminMiddleware, getDoctorsByExamNameController)
router.get('/doctors', tenantMiddleware, authMiddleware, isAdminMiddleware,getDoctorsListController)
router.post('/register', tenantMiddleware, authMiddleware, isAdminMiddleware, registerAdminController);
router.post('/register/patient', authMiddleware, isAdminMiddleware, tenantMiddleware, registerPatientController);
router.put('/update/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, updateAdminController);
router.delete('/delete/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, deleteAdminController);


export default router;