import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import authRoutes from './routes/authRoutes';
import tenantExamRoutes from './routes/tenantExamRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from "./routes/adminRoutes";
import patientExamRoutes from './routes/patientExamRoutes';
import patientRoutes from "./routes/patientRoutes";

dotenv.config();

const app = express();


const options = [
    cors({
        origin: '*',
        methods: '*',
        allowedHeaders: ['Content-Type', 'Authorization',"x-tenant-id"],
        credentials: true,
    })
];

app.use(options);
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', uploadRoutes);
app.use('/clinicexams', tenantExamRoutes)
app.use('/patientExams', patientExamRoutes)
app.use('/patient', patientRoutes)


export default app;
