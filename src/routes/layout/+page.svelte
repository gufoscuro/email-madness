<script lang="ts">
	import HtmlEditor from "$lib/components/HtmlEditor/HtmlEditor.svelte";

	export let data: { layout: string };
</script>

<svelte:head>
	<title>Layout</title>
</svelte:head>

<HtmlEditor isLayoutEditor templateCode={data.layout} />
