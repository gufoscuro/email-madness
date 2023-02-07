<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import CodeMirror from '$lib/components/CodeMirror/CodeMirror.svelte';

    export let name: string;
    export let data: string;
    export let editing: boolean = false;

    let codemirrorInstance: any,
        nameField: any,
        codemirrorValue: string = data;

    const dispatch = createEventDispatcher();

    const onCodeEditorChange = (event: CustomEvent) => {
        // console.log ('onCodeEditorChange', event.detail);
        codemirrorValue = event.detail.value;
        dispatchChange();
    }

    const dispatchChange = (n?: string) => {
        dispatch ('change', {
            name,
            data: codemirrorValue
        })
    }

    const loadData = (nextData: string) => {
        codemirrorInstance.update(nextData);
    }

    $: if (nameField) {
        nameField.focus()
    }
    
    $: if (codemirrorInstance) {
        loadData(data);
    }
    $: dispatchChange(name);
</script>

<style>
    .Code :global(.CodeMirror) {
        height: auto;
        min-height: 100px;
        /* max-height: 300px; */
    }
    .Name :global(input) {
        @apply border-t-0;
        @apply border-l-0;
        @apply border-r-0;
    }
</style>

<div 
    class="grid grid-cols-3 gap-4 rounded-sm cursor-default group hover:bg-slate-700" 
    class:bg-slate-600={editing} class:py-4={editing}>
    <div class="py-1 pl-3 Name">
        {#if editing}
            <input type="text" bind:this={nameField} bind:value={name} />
        {:else}
            <div class="font-semibold">{name}</div>
        {/if}
    </div>
    
    {#if editing}
        <div class="Code text-xs col-span-2 pr-4">
            <CodeMirror bind:this={codemirrorInstance} on:change={onCodeEditorChange} />
        </div>
    {:else}
        <div class="font-mono text-xs">{data.substring(0, 20)}...</div>
    {/if}
    
    {#if !editing}
        <div class="relative">
            <div class="absolute pr-2 top-0 right-0 z-10 invisible group-hover:visible">
                <button class="button-small secondary-button" on:click={() => dispatch('edit')}>Edit</button>
                <button class="button-small danger-button" on:click={() => dispatch('remove')}>Remove</button>
            </div>
        </div>
    {/if}
</div>