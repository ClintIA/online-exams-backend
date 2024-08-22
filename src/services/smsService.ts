import { tenantRepository } from "../repositories/tenantRepository";

export const sendSMS = async (tenantId: number, phoneNumber: string, message: string) => {
    
    const tenant = await tenantRepository.findOne({ where: { id: tenantId }, relations: ["product"] });

    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    if (tenant.smsUsage >= tenant.product.smsLimit) {
        throw new Error('Limite de SMS atingido');
    }

    console.log(`Enviando SMS para ${phoneNumber}: ${message}`);

    tenant.smsUsage += 1;
    await tenantRepository.save(tenant);
};

export const sendLoginTokenSMS = async (tenantId: number, phoneNumber: string, loginToken: string) => {
    const message = `Seu código de login é: ${loginToken}`;
    await sendSMS(tenantId, phoneNumber, message);
};

export const resetSmsUsage = async () => {
    const tenants = await tenantRepository.find();

    for (const tenant of tenants) {
        tenant.smsUsage = 0;
        await tenantRepository.save(tenant);
    }

    console.log('Uso de SMS resetado para todos os tenants.');
};
