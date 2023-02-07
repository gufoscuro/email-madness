import { error } from '@sveltejs/kit';
import { getFile, putFile, getTemplates } from '$lib/services/fileUtil';
import type { RequestEvent } from './$types';
import type { LayoutResponse } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load(): Promise<LayoutResponse> {
    const layout = await getFile('layout.txt');
    const page = await getFile('page.txt');
    const templates = await getTemplates();
    return { layout, page, templates }
}


/** @type {import('./$types').Actions} */
export const actions = {
    save: async (event: RequestEvent) => {
        const form = await event.request.formData();
        const data = form.get('data')?.toString();
        await putFile('page.txt', data);
    }
};