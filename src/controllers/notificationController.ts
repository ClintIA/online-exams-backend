import { findTenantById } from '../services/tenantService';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { WhatsAppMessageType } from '../types/enums/whatsappMessages';
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink';
import dotenv from 'dotenv';

dotenv.config();

export const sendLoginInfoToClient = async (clientData: {
    name: string;
    phoneNumber: string;
    login: string;
    password: string;
    tenantId: number;
}) => {
    const { name, phoneNumber, login, password, tenantId } = clientData;

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(phoneNumber, WhatsAppMessageType.LoginInfo, {
        name,
        clinicName: clinicData.name,
        clinicWhatsAppLink,
        platformLink: process.env.ExamPlatformLink,
        login,
        password
    });
};

export const sendLoginInfoToAdmin = async (adminData: {
    name: string;
    phoneNumber: string;
    login: string;
    password: string;
    tenantId: number;
}) => {
    const { name, phoneNumber, login, password, tenantId } = adminData;

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(phoneNumber, WhatsAppMessageType.AdminLoginInfo, {
        name,
        clinicName: clinicData.name,
        clinicWhatsAppLink,
        platformLink: process.env.AdminPlatformLink,
        login,
        password
    });
};

export const sendExamReadyNotification = async (clientData: {
    name: string;
    phoneNumber: string;
    tenantId: number;
}) => {
    const { name, phoneNumber, tenantId } = clientData;

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(phoneNumber, WhatsAppMessageType.ExamReady, {
        name,
        clinicName: clinicData.name,
        platformLink: process.env.ExamPlatformLink,
        clinicWhatsAppLink
    });
};
