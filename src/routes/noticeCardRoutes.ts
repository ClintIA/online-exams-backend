import { Router } from "express";
import {isAdminMiddleware} from "../middlewares/isAdminMiddleware";
import {tenantMiddleware} from "../middlewares/tenantMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {
    createCardController,
    deleteCardController,
    listNoticeCardController
} from "../controllers/noticeCardController";


const router = Router();

router.post('/',authMiddleware, isAdminMiddleware, tenantMiddleware, createCardController)
router.get('/', authMiddleware, isAdminMiddleware, tenantMiddleware, listNoticeCardController)
router.delete('/:cardId', authMiddleware, isAdminMiddleware, tenantMiddleware, deleteCardController)

export default router;