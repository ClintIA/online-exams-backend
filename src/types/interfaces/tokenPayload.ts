import {ProfileRole} from "../enums/role";

export interface TokenPayload {
    userId: number;
    tenantId?: number;
    role: ProfileRole;

}