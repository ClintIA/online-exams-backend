import { Router } from 'express';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';
import {tenantMiddleware} from "../middlewares/tenantMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {createListAvailability, createNewAvailability} from "../controllers/doctorAvailabilityController";

const router = Router();

router.post('/', tenantMiddleware, createNewAvailability );
router.post('/list', tenantMiddleware, createListAvailability);

export default router;