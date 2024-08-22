import { resetSmsUsage } from '../services/smsService';
import { schedule } from 'node-cron';

schedule('0 0 1 * *', async () => {
    console.log('Resetando limite de SMS para todos os tenants...');
    await resetSmsUsage();
    console.log('Limite de SMS resetado com sucesso.');
});
