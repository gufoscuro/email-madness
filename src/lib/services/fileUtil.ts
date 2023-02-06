import fs from 'fs/promises';
import path from 'path';


const filePathBase = './artifacts/';
const getFilePath = (fileType: string) => filePathBase + fileType + '.txt';
const getTemplate = async () => getFile(getFilePath('template'));
const getLayout = async () => getFile(getFilePath('layout'));
 
export const getFile = async (fileType: string) => {
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