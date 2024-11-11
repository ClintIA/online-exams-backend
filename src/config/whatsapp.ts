import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.on('authenticated', () => {
    console.log('WhatsApp authentication successful!');
});

client.on('auth_failure', () => {
    console.error('Authentication failed, please check your credentials.');
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp client disconnected:', reason);
});

export const initializeWhatsApp = async () => {
    await client.initialize();
};

export const getWhatsAppClient = () => client;
