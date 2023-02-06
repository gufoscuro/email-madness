<script lang="ts">
	import HtmlEditor from "$lib/components/HtmlEditor/HtmlEditor.svelte";

	export let data: { template: string, layout: string };
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<HtmlEditor templateCode={data.template} layoutCode={data.layout} />
