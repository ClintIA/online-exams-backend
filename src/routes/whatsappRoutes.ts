
import {Request, Response, Router} from "express";
import {errorResponse, successResponse} from "../utils/httpResponses";
import {client} from "../index";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // Exemplo de mensagem transacional automatizada
        const numeroCliente = '5521971882838@c.us';
        const mensagem = 'Olá, João Silva! Você foi cadastrado(a) na clínica Saúde Mais.\n' +
            '\n' +
            'Aqui estão suas informações de acesso:\n' +
            'Login (CPF): 999999999\n' +
            'Senha: 123456\n' +
            'Utilize essas informações na nossa plataforma https://saudemais.com para visualizar seus exames.\n' +
            '\n' +
            'Em caso de dúvidas, entre em contato com o WhatsApp da clínica através do link: https://wa.me/5599999999999';

        await client.sendMessage(numeroCliente, mensagem)
        return successResponse(res, null, 'Mensagem enviada');
    } catch (error) {
        return errorResponse(res, error);
    }
});

export default router;