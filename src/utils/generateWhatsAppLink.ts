export function generateWhatsAppLink(phone: string): string {
    if (!phone.startsWith("55")) {
        phone = `55${phone}`;
    }
    return `https://wa.me/${phone}`;
}