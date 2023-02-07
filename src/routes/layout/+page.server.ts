import { error } from '@sveltejs/kit';
import { getFile, putFile, getTemplates } from '$lib/services/fileUtil';
import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutResponse } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load(): Promise<LayoutResponse> {
    const templates = await getTemplates();
    const layout = await getFile('layout.txt');
    return { layout, templates }
}


/** @type {import('./$types').Actions} */
export const actions = {
    save: async (event: RequestEvent) => {
        const form = await event.request.formData();
        const data = form.get('data')?.toString();
        await putFile('layout.txt', data);
    }
};