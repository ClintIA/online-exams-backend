"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = void 0;
var path_1 = require("path");
var dotenv = require("dotenv");
var swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
dotenv.config();
exports.NODE_ENV = process.env.NODE_ENV === 'production' ? 'https://api.clintia.com.br' : 'http://localhost:3000';
var doc = {
    info: {
        version: "1.0.0",
        title: "API DOC - ClintIA Soluções tecnólogicas",
        description: "API Documentation to ClintIA",
    },
    servers: [
        {
            url: exports.NODE_ENV,
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
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};
var outputFile = (0, path_1.resolve)(__dirname, './swagger-output.json');
var endpointsFiles = [(0, path_1.resolve)(__dirname, './routes.ts')];
swaggerAutogen(outputFile, endpointsFiles, doc).then(function () {
    require('./index.ts');
});
