import { DataSource } from 'typeorm';
import { Admin } from '../models/Admin';
import { Patient } from '../models/Patient';
import { Tenant } from '../models/Tenant';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Admin, Patient, Tenant, User],
    synchronize: true,
    logging: true,
});

export const connectDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        throw error;
    }
};
