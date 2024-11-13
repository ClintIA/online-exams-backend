"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var dotenv = require("dotenv");
var swagger_autogen_1 = require("swagger-autogen");
dotenv.config();
var doc = {
    info: {
        version: "1.0.0",
        title: "API DOC - ClintIA Soluções tecnólogicas",
        description: "API Documentation to ClintIA",
    },
    servers: [
        {
            url: 'https://api.clintia.com.br',
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
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(function () {
    require('./index');
});
