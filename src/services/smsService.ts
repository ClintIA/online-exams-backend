export const sendLoginTokenSMS = (phoneNumber: string, loginToken: string) => {
    console.log(`Enviando token de login: ${loginToken} para o número: ${phoneNumber}`);
};