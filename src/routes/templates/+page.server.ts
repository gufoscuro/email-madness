import { getTemplates } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const templates = await getTemplates();
    return { templates }
}