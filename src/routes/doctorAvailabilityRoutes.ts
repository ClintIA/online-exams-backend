import { Router } from 'express';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import {tenantMiddleware} from "../middlewares/tenantMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    createListAvailability,
    createNewAvailability,
    listDoctorAvailability
} from "../controllers/doctorAvailabilityController";

const router = Router();

router.post('/', tenantMiddleware, createNewAvailability );
router.post('/list', tenantMiddleware, createListAvailability);
router.get('/list',tenantMiddleware, listDoctorAvailability)
router.get('/list/:availabilityDate/:doctorId',tenantMiddleware, listDoctorAvailability)
export default router;