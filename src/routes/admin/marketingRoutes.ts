import {Router} from "express";
import {
    countPatientByMonthController, examPriceController,
    getTotalInvoiceWithFiltersController
} from "../../controllers/marketingController";
import {tenantMiddleware} from "../../middlewares/tenantMiddleware";


const router = Router();

router.get('/marketing', tenantMiddleware,getTotalInvoiceWithFiltersController);
router.get('/marketing/countPatient', tenantMiddleware,countPatientByMonthController);
router.get('/marketing/examPrice', tenantMiddleware,examPriceController);

export default router;