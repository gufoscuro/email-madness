import fs from 'fs/promises';
import path from 'path';
import type { TemplateMap } from '../utils/templates';


const filePathBase: string = './artifacts/';
const getFilePath = (fileName: string, fileBase?: string) => path.join(fileBase ? fileBase : filePathBase, fileName);

export type LayoutResponse = {
    layout: string;
    page?: string;
    file?: string;
    templates?: TemplateMap;
}
 
export const getFile = async (fileType: string, fileExtension?: string) => {
    try {
        const filePath = getFilePath(fileType);
        await fs.access(filePath, fs.constants.F_OK);
        return (await fs.readFile(filePath, { encoding: 'utf-8' }));
    } catch {
        return '';
    }
}

export const putFile = async (fileType: string, fileContent: string | undefined) => {
    try {
        const filePath = getFilePath(fileType);
        await fs.writeFile(filePath, fileContent || '');
    } catch {
        console.log ('error while writing')
    }
}

export const getTemplates = async () => {
    try {
        const templatesString = await getFile('templates.json');
        return JSON.parse(templatesString);
    } catch {
        return {};
    }
}

export const putTemplates = async (data: {[key: string] : string}) => {
    try {
        const templatesString = JSON.stringify(data, null, '   ');
        await putFile('templates.json', templatesString)
    } catch {
        console.error ('error while putting templates')
    }
}

export const listEmailTemplates = async () => {
    try {
        const files = await fs.readdir(path.resolve('./email-templates/export'), { withFileTypes: true });
        return files.filter(it => !it.isDirectory() && it.name.endsWith('.html')).map(it => it.name);
    } catch {
        return []
    }
}

export const getEmailTemplate = async (name: string) => {
    try {
        const chunkFilePath = getFilePath(name, './email-templates/chunks/');
        const filePath = getFilePath(name, './email-templates/export/');
        try {
            await fs.access(chunkFilePath, fs.constants.F_OK);
            return (await fs.readFile(chunkFilePath, { encoding: 'utf-8' }));
        } catch {
            await fs.access(filePath, fs.constants.F_OK);
            return (await fs.readFile(filePath, { encoding: 'utf-8' }));
        }
    } catch {
        throw new Error('Not Found');
    }
}

export const putEmailTemplate = async (name: string, content: string | undefined) => {
    try {
        const filePath = getFilePath(name, './email-templates/chunks/');
        await fs.writeFile(filePath, content || '');
    } catch {
        console.log ('error while writing')
    }
}

export const exportEmailTemplate = async (name: string, content: string | undefined) => {
    try {
        const filePath = getFilePath(name, './email-templates/export/');
        await fs.writeFile(filePath, content || '');
    } catch {
        console.log ('error while writing')
    }
}