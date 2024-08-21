import { DataSource } from 'typeorm';
import { Admin } from '../models/Admin';
import { Patient } from '../models/Patient';
import { Tenant } from '../models/Tenant';
import { User } from '../models/User';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: "localhost",
    port: Number(process.env.DB_PORT),
    username: "postgres",
    password: "postgres",
    database: "postgres",
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
