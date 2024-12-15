import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types/interfaces/tokenPayload';
import {ProfileRole} from "../types/enums/role";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId: number, role: ProfileRole, tenantId?: number): string => {
    const payload: TokenPayload =  { userId, tenantId: tenantId!, role };
    
    const expiresIn = role === 'admin' ? '7d' : '3d';

    return jwt.sign(payload, JWT_SECRET!, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET!) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
