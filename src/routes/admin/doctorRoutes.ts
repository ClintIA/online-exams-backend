import {tenantMiddleware} from "../../middlewares/tenantMiddleware";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {isAdminMiddleware} from "../../middlewares/isAdminMiddleware";
import {
    getDoctorsByExamNameController,
    getDoctorsListController,
} from "../../services/doctorService";
import { Router } from 'express';
import {
    deleteDoctorController,
    registerDoctorController,
    updateDoctorController
} from "../../controllers/doctorController";

const router = Router();

router.get('/exam', tenantMiddleware, authMiddleware, isAdminMiddleware, getDoctorsByExamNameController)
router.get('/', tenantMiddleware, authMiddleware, isAdminMiddleware,getDoctorsListController)
router.post('/', authMiddleware, isAdminMiddleware, tenantMiddleware, registerDoctorController);
router.put('/update/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, updateDoctorController);
router.delete('/delete/:id', tenantMiddleware, authMiddleware, isAdminMiddleware, deleteDoctorController);


export default router;