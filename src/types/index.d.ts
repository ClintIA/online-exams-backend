import { Request } from 'express';
import {ProfileRole} from "./enums/role";

declare module 'express' {
    export interface Request {
        tenantId?: number;
        patientId?: number;
        user?: {
            userId: number;
            tenantId?: number;
            role: ProfileRole;
        };
    }
}
