import axios from 'axios';
import { tenantRepository } from '../repositories/tenantRepository';
import dotenv from 'dotenv';

dotenv.config();

const smsApiKey = process.env.SMS_API_KEY;

export const sendSMS = async (tenantId: number, phoneNumber: string) => {
    const tenant = await tenantRepository.findOne({ where: { id: tenantId }, relations: ["product"] });

    if (!tenant) {
        throw new Error('Tenant não encontrado');
    }

    if (tenant.smsUsage >= tenant.product.smsLimit) {
        throw new Error('Limite de SMS atingido');
    }

    const template = "<#> Seu código de verificação é: {999-999}";
    const expireTime = process.env.SMS_CODE_EXPIRATION || 300;

    const smsSendApiUrl = process.env.SMS_SEND_API_URL;

    try {
        const response = await axios.post("https://api.smstoken.com.br/token/v1/verify", {
            key: smsApiKey,
            number: phoneNumber,
            template: template,
            expire: expireTime,
        });

        const { situacao, code, descricao } = response.data;
        if (situacao !== 'OK') {
            throw new Error(`Erro ao enviar SMS: ${descricao}`);
        }

        console.log(`SMS enviado para ${phoneNumber}: ${descricao}`);

        tenant.smsUsage += 1;
        await tenantRepository.save(tenant);

        return code;
    } catch (error: any) {
        throw new Error(`Erro ao enviar SMS: ${error.message}`);
    }
};


export const checkSMSCode = async (phoneNumber: string, code: string) => {
    const smsCheckApiUrl = process.env.SMS_CHECK_API_URL;

    try {
        const response = await axios.post("https://api.smstoken.com.br/token/v1/check", {
            key: smsApiKey,
            number: phoneNumber,
            code: code,
        });

        const { situacao, checked, descricao } = response.data;
        if (situacao !== 'OK' || !checked) {
            throw new Error(`Erro ao validar código: ${descricao}`);
        }

        return true;
    } catch (error: any) {
        throw new Error(`Erro ao validar código: ${error.message}`);
    }
};

export const resetSmsUsage = async () => {
    const tenants = await tenantRepository.find();

    for (const tenant of tenants) {
        tenant.smsUsage = 0;
        await tenantRepository.save(tenant);
    }

    console.log('Uso de SMS resetado para todos os tenants.');
};
