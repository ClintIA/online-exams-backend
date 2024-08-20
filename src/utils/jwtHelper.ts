import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload {
    userId: number;
    tenantId: number;
    isAdmin: boolean;
}

export const generateToken = (userId: number, tenantId: number, isAdmin: boolean): string => {
    const payload: TokenPayload = { userId, tenantId, isAdmin };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
