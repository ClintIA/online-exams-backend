import app from "./routes";
import { connectDatabase } from './config/database';
import {Client, LocalAuth} from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDatabase();
        console.log('Conexão com o banco de dados estabelecida com sucesso');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

export const client = new Client({
    authStrategy: new LocalAuth(),  // Mantém a sessão ativa no local
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('WhatsApp Web conectado e pronto para enviar mensagens!');

});

client.initialize().then()
startServer().then();
