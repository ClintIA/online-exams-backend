import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import swaggerDocument from './swagger-output.json'
import app from "./routes";
import {connectDatabase} from "./config/database";
import { initializeWhatsApp } from './config/whatsapp';
import { redisClient } from './config/redis';

const PORT = process.env.PORT || 3000;
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

const startServer = async () => {
    try {
        app.use(bodyParser.json());
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{
            customCss:
                '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
            customCssUrl: CSS_URL
        }));

        await connectDatabase();
        console.log('Database Connected');

        await redisClient.connect();
        console.log('Redis Client Connected');

       // await initializeWhatsApp();
       // console.log('WhatsApp Client Initialized');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer().then();
