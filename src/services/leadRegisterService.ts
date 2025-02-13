import {tenantRepository} from "../repositories/tenantRepository";
import {leadRegisterRepository} from "../repositories/leadRegisterRepository";
import {Tenant} from "../models/Tenant";


export interface CreateLeadRegisterDTO {
    full_name: string;
    phone: string;
    diagnostic?: string;
    obs?: string;
    canal?: string;
    isPatient?: boolean;
    gender?: string;
    tenants?: Tenant[];
}

export const createLeadRegisterService = async (createLeadRegisterDTO: CreateLeadRegisterDTO, tenantID: number)  => {
        try {

            const tenants: Tenant[] = [];
            const leadRegister: CreateLeadRegisterDTO = {
                full_name: createLeadRegisterDTO.full_name,
                phone: createLeadRegisterDTO.phone,
                diagnostic: createLeadRegisterDTO.diagnostic,
                obs: createLeadRegisterDTO.obs,
                canal: createLeadRegisterDTO.canal,
                isPatient: createLeadRegisterDTO.isPatient,
                gender: createLeadRegisterDTO.gender,
            };
                const tenant = await tenantRepository.findOne({ where: { id: tenantID}})
                if(tenant) {
                    tenants.push(tenant);
                    leadRegister.tenants = tenants
                }

            return await leadRegisterRepository.save(leadRegister);
        } catch (error) {
            throw new Error(`Failed to create lead register: ${error}`);
        }
    }

    // Get all lead registers
export const findAll = async (tenantID: number) => {
        return await leadRegisterRepository.find({
            where: {
                tenants: {
                    id: tenantID
                }
            },
            relations: ['tenants']
        });
    }


  export const findOne = async (id: number,tenantID: number) => {
        return await leadRegisterRepository.findOne({
            where: { id,
            tenants: {
                id: tenantID
            }},
            relations: ['tenants']
        });
    }

    export const updateLeadService = async (id: number, updateData: Partial<CreateLeadRegisterDTO>, tenantId: number) => {
        try {
            const leadRegister = await leadRegisterRepository.findOne({
                where: { id },
                relations: ['tenants']
            });

            if (!leadRegister) {
                throw new Error('Lead register not found');
            }

            // Update basic properties
            Object.assign(leadRegister, updateData);

            const tenant = await tenantRepository.findOne({ where: { id: tenantId}})
            if(tenant) {
                leadRegister.tenants.push(tenant);
            }


            return await leadRegisterRepository.save(leadRegister);
        } catch (error) {
            throw new Error(`Failed to update lead register: ${error}`);
        }
    }

    // Soft delete lead register
    export const softDelete = async (id: number): Promise<void> => {
        await leadRegisterRepository.softDelete(id);
    }


    export const remove = async (id: number): Promise<void>  => {
        await leadRegisterRepository.delete(id);
    }

   export const search = async (query: string) =>  {
        return await leadRegisterRepository
            .createQueryBuilder('leadRegister')
            .leftJoinAndSelect('leadRegister.tenants', 'tenants')
            .where('leadRegister.full_name ILIKE :query', { query: `%${query}%` })
            .orWhere('leadRegister.phone ILIKE :query', { query: `%${query}%` })
            .getMany();
}
