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

router.post('/',tenantMiddleware, createCardController)
router.get('/', tenantMiddleware, listNoticeCardController)
router.delete('/:cardId', tenantMiddleware, deleteCardController)

export default router;