import jwt from 'jsonwebtoken';

const JWT_SECRET = "b356a576a560dadf85999b54209f60bdb7b919bc5f92df0f29e48e5daa61a206";

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
