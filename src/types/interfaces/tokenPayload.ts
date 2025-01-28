export interface TokenPayload {
    userId: number;
    tenantId?: number;
    role: string;
    tenantName?: string;
}