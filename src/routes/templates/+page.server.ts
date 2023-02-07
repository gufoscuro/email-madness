import { error } from '@sveltejs/kit';
import { getTemplates } from '$lib/services/fileUtil';
import type { RequestEvent } from '@sveltejs/kit';
 
/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const templates = await getTemplates();
    return { templates }
}