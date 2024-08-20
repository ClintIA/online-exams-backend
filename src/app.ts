import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import authRoutes from './routes/authRoutes';
import { tenantMiddleware } from './middlewares/tenantMiddleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(tenantMiddleware);

app.use('/auth', authRoutes);

export default app;
