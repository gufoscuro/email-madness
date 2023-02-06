import { error } from '@sveltejs/kit';
import { getFile, putFile } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const layout = await getFile('layout');
    return { layout }
}


/** @type {import('./$types').Actions} */
export const actions = {
    save: async (event) => {
        const form = await event.request.formData();
        const data = form.get('data')?.toString();
        await putFile('layout', data);
    }
};