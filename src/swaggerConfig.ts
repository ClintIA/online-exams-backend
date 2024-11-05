import { resolve } from 'path';
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });


const doc = {
    info: {
        version: "1.0.0",
        title: "API DOC - ClintIA Soluções tecnólogicas",
        description: "API Documentation to ClintIA",
    },
    servers: [
        {
            url: 'https://api.clintia.com.br'
        }
    ],
    components: {
        schemas: {
            someBody: {
                $name: "Jhon Doe",
                $age: 29,
                about: ""
            },
            someResponse: {
                name: "Jhon Doe",
                age: 29,
                diplomas: [
                    {
                        school: "XYZ University",
                        year: 2020,
                        completed: true,
                        internship: {
                            hours: 290,
                            location: "XYZ Company"
                        }
                    }
                ]
            },
            someEnum: {
                '@enum': [
                    "red",
                    "yellow",
                    "green"
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

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.ts');
});