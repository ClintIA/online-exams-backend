import { Router } from 'express';
import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "../../uploadthing";
import { authMiddleware } from '../../middlewares/authMiddleware';
import { isAdminMiddleware } from '../../middlewares/isAdminMiddleware';
import { tenantMiddleware } from '../../middlewares/tenantMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post(
  "/uploadthing",
  authMiddleware,
  tenantMiddleware,
  isAdminMiddleware,
  createRouteHandler({
    router: ourFileRouter,
    config: {
      uploadthingId: process.env.UPLOADTHING_APP_ID,
      uploadthingSecret: process.env.UPLOADTHING_SECRET,
    },
  })
);

export default router;
