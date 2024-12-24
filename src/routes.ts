import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import authRoutes from './routes/auth/authRoutes';
import tenantExamRoutes from './routes/admin/tenantExamRoutes';
import adminRoutes from "./routes/admin/adminRoutes";
import patientRoutes from "./routes/user/patientRoutes";
import noticeCardRoutes from "./routes/admin/noticeCardRoutes";
import adminExamRoutes from "./routes/admin/adminExamRoutes";
import adminPatientRoutes from "./routes/admin/adminPatientRoutes";
import patientExamRoutes from "./routes/user/patientExamRoutes";
import doctorRoutes from "./routes/admin/doctorRoutes";
import marketingRoutes from "./routes/admin/marketingRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth',
    authRoutes
);
app.use('/api/v1/admin', [
    adminRoutes,
    adminPatientRoutes,
    adminExamRoutes,
    tenantExamRoutes,
    noticeCardRoutes,
    doctorRoutes,
    marketingRoutes
])
app.use('/api/v1/patient', [
    patientRoutes,
    patientExamRoutes
])

export default app;