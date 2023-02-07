import fs from 'fs/promises';
import path from 'path';
import type { TemplateMap } from '../utils/templates';


const filePathBase = './artifacts/';
const getFilePath = (fileName: string) => filePathBase + fileName;

export type LayoutResponse = {
    layout: string;
    page?: string;
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