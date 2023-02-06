<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import CodeMirror from "../CodeMirror/CodeMirror.svelte";

    // const dispatch = createEventDispatcher();

    // const onEditorChange = (event: any) => {
    //     console.log ('onEditorChange', event);
    //     // dispatch('change', data)
	// }
</script>

<div class="Editor h-full text-sm">
    <CodeMirror on:change />
</div>