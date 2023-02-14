import { error } from '@sveltejs/kit';
import { listEmailTemplates } from '$lib/services/fileUtil';
 
/** @type {import('./$types').PageServerLoad} */
export async function load(): Promise<{ files: Array<string> }> {
    const files = await listEmailTemplates();
    return { files }
}