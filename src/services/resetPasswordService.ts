import { redisClient } from '../config/redis';
import { adminRepository } from '../repositories/adminRepository';
import { patientRepository } from '../repositories/patientRepository';
import { RequestPasswordResetDTO } from '../types/dto/resetPassword/RequestPasswordResetDTO';
import { ResetPasswordDTO } from '../types/dto/resetPassword/ResetPasswordDTO';
import { ValidateResetTokenDTO } from '../types/dto/resetPassword/ValidateResetTokenDTO';
import { sendWhatsAppMessage } from './whatsappService';
import bcrypt from 'bcryptjs';

export const requestPasswordReset = async (data: RequestPasswordResetDTO) => {
    const isEmail = data.identifier.includes('@');
    let user: any = null;

    if (isEmail) {
        user = await adminRepository.findOne({ where: { email: data.identifier } });
    } else {
        user = await patientRepository.findOne({ where: { cpf: data.identifier } });
    }

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    const token = Math.floor(1000 + Math.random() * 9000).toString();

    await redisClient.set(`password-reset:${data.identifier}`, token, { EX: 300 });

    const phone = user.phone;
    if (!phone) {
        throw new Error('Número de telefone não encontrado.');
    }

    await sendWhatsAppMessage(phone, 'Recuperação de Senha', { token });

    return { message: 'Token enviado para o WhatsApp registrado.' };
};

export const validateResetToken = async (data: ValidateResetTokenDTO) => {
    const storedToken = await redisClient.get(`password-reset:${data.identifier}`);

    if (!storedToken) {
        throw new Error('Token expirado ou inválido.');
    }

    if (storedToken !== data.token) {
        throw new Error('Token inválido.');
    }

    return { message: 'Token válido.' };
};

export const resetPassword = async (data: ResetPasswordDTO) => {
    const isEmail = data.identifier.includes('@');
    let user: any = null;

    const resetToken = await redisClient.get(`password-reset:${data.identifier}`);
    if (!resetToken || resetToken !== data.token) {
        throw new Error('Token inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    if (isEmail) {
        user = await adminRepository.update({ email: data.identifier }, { password: hashedPassword });
    } else {
        user = await patientRepository.update({ cpf: data.identifier }, { password: hashedPassword });
    }

    if (!user) throw new Error('Usuário não encontrado.');

    const phone = (user as any).phone;
    if (phone) {
        await sendWhatsAppMessage(phone, 'Senha Alterada', { message: 'Sua senha foi alterada com sucesso.' });
    }

    await redisClient.del(`password-reset:${data.identifier}`);

    return { message: 'Senha redefinida com sucesso.' };
};

