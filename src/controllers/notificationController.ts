import { findTenantById } from '../services/tenantService';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { WhatsAppMessageType } from '../types/enums/whatsappMessages';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
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

    const formatedNumber = formatPhoneNumber(phoneNumber);

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(formatedNumber.toString(), WhatsAppMessageType.LoginInfo, {
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

    const formatedNumber = formatPhoneNumber(phoneNumber);

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(formatedNumber.toString(), WhatsAppMessageType.AdminLoginInfo, {
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

    const formatedNumber = formatPhoneNumber(phoneNumber);

    const clinicData = await findTenantById(tenantId);

    if (!clinicData) {
        throw new Error('Tenant not found');
    }

    const clinicWhatsAppLink = generateWhatsAppLink(clinicData.whatsAppNumber);

    await sendWhatsAppMessage(formatedNumber.toString(), WhatsAppMessageType.ExamReady, {
        name,
        clinicName: clinicData.name,
        platformLink: process.env.ExamPlatformLink,
        clinicWhatsAppLink
    });
};
