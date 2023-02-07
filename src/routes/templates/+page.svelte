<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { FlyParams } from 'svelte/transition';
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
        savedMessage: boolean = false,
        currentlyEditing: TemplateInternalObject;
    
    const savedMessageFX: FlyParams = {
        duration: 300,
        x: 30
    }

    const onSave = async () => {
        disableCurrentlyEditing();
        templatesList = templatesList;
        const result: TemplatesObject = Object.assign({}, ...templatesList.filter(it => it.name.trim() !== '').map (s => ({[s.name]: s.data})));
        console.log ('saving templates', result)

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
        savedMessage = true;
        loadData({ templates: result });
        setTimeout(() => (savedMessage = false), 1200);
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
        element.name = nextValues.name as string;
        element.data = nextValues.data as string;
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
    <button class="button secondary-button" on:click={onSave} disabled={saveBusy}>Save Changes</button>
    {#if savedMessage}
        <div class="ml-4 text-green-400 font-semibold" transition:fly={savedMessageFX}>Saved Successfully!</div>
    {/if}
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
