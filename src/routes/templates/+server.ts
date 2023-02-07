import { error, json } from '@sveltejs/kit';
import { putTemplates } from '$lib/services/fileUtil';
 
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const body = await request.json();
    await putTemplates(body);
    return json(body)
}