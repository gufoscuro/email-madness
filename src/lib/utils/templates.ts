export type TemplateMap = {
    [ key: string ]: string
}
export function templateReplacer (templates: TemplateMap, name: string, content: string) {
    // return templates[name] ? templates[name] : 'not found';
    return templates[name] ? templates[name].replace(/{{content}}/g, content) : 'not found';
}

export function templateMatcher (templates: TemplateMap, content: string): string {
    return content.replace(/{{!?template name\(([a-zA-Z\-]+)\)( content\([a-zA-Z0-9!@#\$%\^\&*\-\s:,;\.]+\))?!?}}/g, function($0, $1, $2) {
        const matches = $2 ? $2.match(/content\(([a-zA-Z0-9!@#\$%\^\&*\-\s:,;\.]+)\)/) : null;
        const templateContent = matches ? matches[1] : '';
        const commented = $0 ? $0.startsWith('{{!template') : false;
        // console.log ('templateMatcher', $0 ? $0 : 'seghe');
        return commented ? '' : templateReplacer(templates, $1, templateContent)
        // return templateReplacer(templates, $1, templateMatcher(templates, $2))
    });
}