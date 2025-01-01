import {Router} from "express";
import {
    countPatientByMonthController,
    createCanalController,
    examPriceController,
    countPatientExamWithFilterController,
    listCanalController,
    updateCanalController,
    deleteCanalController,
    getBudgetByTenantController, updateBudgetByTenantController
} from "../../controllers/marketingController";
import {tenantMiddleware} from "../../middlewares/tenantMiddleware";


const router = Router();

router.get('/marketin/countPatientExam', tenantMiddleware,countPatientExamWithFilterController);
router.get('/marketing/countPatient', tenantMiddleware,countPatientByMonthController);
router.get('/marketing/examPrice', tenantMiddleware,examPriceController);
router.get('/marketing/tenantBudget', tenantMiddleware, getBudgetByTenantController)
router.put('/marketing/tenantBudget', tenantMiddleware, updateBudgetByTenantController)
router.post('/marketing/canal',tenantMiddleware,createCanalController)
router.get('/marketing/canal', tenantMiddleware,listCanalController)
router.put('/marketing/canal', tenantMiddleware, updateCanalController)
router.delete('/marketing/canal', tenantMiddleware, deleteCanalController)
export default router;