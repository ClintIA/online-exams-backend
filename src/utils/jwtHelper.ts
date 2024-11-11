import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types/interfaces/tokenPayload';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId: number, isAdmin: boolean, tenantId?: number): string => {
    const payload: TokenPayload = isAdmin ? { userId, tenantId: tenantId!, isAdmin } : { userId, isAdmin };
    
    const expiresIn = isAdmin ? '7d' : '3d';

    return jwt.sign(payload, JWT_SECRET!, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET!) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
