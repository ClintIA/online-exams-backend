import { Request } from 'express';

declare module 'express' {
    export interface Request {
        tenantId?: number;
        user?: {
            userId: number;
            tenantId: number;
            isAdmin: boolean;
        };
    }
}
