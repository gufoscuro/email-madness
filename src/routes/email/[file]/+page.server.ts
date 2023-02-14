import { error } from '@sveltejs/kit';
import { getFile, putFile, getTemplates, getEmailTemplate, putEmailTemplate, exportEmailTemplate } from '$lib/services/fileUtil';
import type { RequestEvent } from './$types';
import type { LayoutResponse } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }): Promise<LayoutResponse> {
    if (params.file !== undefined) {
        try {
            const file = params.file;
            const layout = await getFile('layout.txt');
            const templates = await getTemplates();
            const page = await getEmailTemplate(file);
            return { layout, page, templates, file }
        } catch {
            throw error(404, 'Not found');
        }
    }
    throw error(404, 'Not found');
}

/** @type {import('./$types').Actions} */
export const actions = {
    save: async (event: RequestEvent) => {
        const file = event.params.file;
        const form = await event.request.formData();
        const data = form.get('data')?.toString();
        await putEmailTemplate(file, data);
    },
    export: async (event: RequestEvent) => {
        const file = event.params.file;
        console.log ('export feature', file)
        if (file !== undefined) {
            try {
                const form = await event.request.formData();
                const data = form.get('data')?.toString();
                await exportEmailTemplate(file, data);
            } catch {
                throw error(404, 'Not found');
            }
        }
        throw error(404, 'Not found');
    }
};