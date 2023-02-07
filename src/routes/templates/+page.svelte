<script lang="ts">
    import TemplateRow from "./TemplateRow.svelte";

    type TemplatesObject = {
        [key: string]: string;
    }
    type TemplateInternalObject = {
        name: string;
        data: string;
        editing?: boolean;
    }
    type DataObject = {
        templates: TemplatesObject
    }

	export let data: DataObject;

    let templates: TemplatesObject = {},
        templatesList: Array<TemplateInternalObject>,
        saveBusy: boolean = false,
        currentlyEditing: TemplateInternalObject;
        
    // const templates: {[key: string]: string} = {
    //     wrapper: '<div class="wrapper p-4 bg-gray-600">this is the wrapper{{content}}</div>',
    //     nested: '<button>{{content}}</button>',
    //     inner: '<div class="p-2 bg-red-200">INNER</div><div>{{content}}</div>'
    // }
    // const templateString = `{{em:template name:wrapper}}
    //         <div class="whatever">
    //             <tr>
    //                 <td><p>Something</p></td>
    //             </tr>
    //             {{em:template name:inner}}
    //                 inner
    //                 {{em:template name:nested}}My Button{{/em:template}}
    //             {{/em:template}}
    //         something
    //         </div>
    //     {{/em:template}}`;

    

    const onSave = async () => {
        disableCurrentlyEditing();
        templatesList = templatesList;
        const result: TemplatesObject = Object.assign({}, ...templatesList.filter(it => it.name.trim() !== '').map (s => ({[s.name]: s.data})));
        // console.log ('result', result);

        saveBusy = true;
		await fetch('/templates', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(result)
		});

		saveBusy = false;
    }

    const disableCurrentlyEditing = () => {
        if (currentlyEditing) {
            currentlyEditing.editing = false;
        }
    }

    const setCurrentlyEditing = (element: TemplateInternalObject) => {
        currentlyEditing = element;
    }

    const onAdd = () => {
        disableCurrentlyEditing();
        const nextItem = {
            name: '',
            data: '',
            editing: true
        };
        templatesList.push(nextItem);
        setCurrentlyEditing(nextItem);
        templatesList = templatesList;
    }

    const onEdit = (element: TemplateInternalObject) => {
        disableCurrentlyEditing();
        element.editing = true;
        setCurrentlyEditing(element);
        templatesList = templatesList;
    }

    const onRemove = (element: TemplateInternalObject) => {
        disableCurrentlyEditing();
        templatesList.splice(templatesList.indexOf(element), 1);
        templatesList = templatesList;
    }

    const loadData = (data: DataObject) => {
        templates = data.templates
    }

    const onChange = (element: TemplateInternalObject, nextValues: Partial<TemplateInternalObject>) => {
        // console.log ('onChange', nextValues)
        element.name = nextValues.name;
        element.data = nextValues.data;
    }

    const updateTemplatesList = (names?: Array<string>) => {
        templatesList = templatesNames.map(it => ({ name: it, data: templates[it] }));
    }

    $: loadData(data);
    $: templatesNames = Object.keys(templates);
    $: updateTemplatesList(templatesNames);
</script>

<svelte:head>
	<title>Templates</title>
</svelte:head>

<div class="flex items-center justify-start px-4 h-12">
    <button class="button primary-button" on:click={onAdd}>Add Template</button>
    <button class="button secondary-button" on:click={onSave}>Save Changes</button>
</div>
<div class="p-2">
    {#each templatesList as template}
        <TemplateRow 
            name={template.name}
            data={template.data}
            editing={template.editing} 
            on:change={(event) => onChange(template, event.detail)}
            on:edit={() => onEdit(template)} 
            on:remove={() => onRemove(template)} />
    {/each}
</div>
