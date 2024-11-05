import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import swaggerDocument from '../src/swagger-output.json'
import app from "./routes";
import {connectDatabase} from "./config/database";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        app.use(bodyParser.json());
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        await connectDatabase();
        console.log('Database Connected');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer().then();
