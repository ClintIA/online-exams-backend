import { resolve } from 'path';
import * as dotenv from "dotenv";
import swaggerAutogen from 'swagger-autogen';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV === 'production' ? 'https://api.clintia.com.br' : 'http://localhost:3000'
const doc = {
    info: {
        version: "1.0.0",
        title: "API DOC - ClintIA Soluções tecnólogicas",
        description: "API Documentation to ClintIA",
    },
    servers: [
        {
            url: NODE_ENV,
        }
    ],
    components: {
        schemas: {
            someResponse: {
                status: "string",
                message: "string",
                data: [{}]
            },
            status: {
                'status': [
                    "Agendado",
                    "InProgress",
                    "Completed"
                ]
            }
        },
        securitySchemes:{
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = resolve(__dirname, './swagger-output.json');
const endpointsFiles = [resolve(__dirname, './routes.ts')];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc).then(() => {
    require('./index.ts');
});