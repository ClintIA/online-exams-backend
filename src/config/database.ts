import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../models/*.ts'],
    synchronize: true,
});

export const connectDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Conectado ao banco de dados');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados', error);
        process.exit(1);
    }
};

export default AppDataSource;