import fs from 'fs';
import path from 'path';

const templates = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../templates/whatsappMessages.json'), 'utf-8')
);

export const getTemplateMessage = (key: string, params: any): string => {
    let template = templates[key];

    if (!template) {
        throw new Error(`Template with key "${key}" not found.`);
    }

    Object.keys(params).forEach((param) => {
        const regex = new RegExp(`{{${param}}}`, 'g');
        template = template.replace(regex, params[param]);
    });

    return template;
};
