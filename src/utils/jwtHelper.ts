import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
    userId: number;
    tenantId?: number;
    isAdmin: boolean;
}

export const generateToken = (userId: number, isAdmin: boolean, tenantId?: number): string => {
    const payload: TokenPayload = isAdmin ? { userId, tenantId: tenantId!, isAdmin } : { userId, isAdmin };
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET!) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
