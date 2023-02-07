<script lang="ts">
	import HtmlEditor from "$lib/components/HtmlEditor/HtmlEditor.svelte";
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Layout</title>
</svelte:head>

<HtmlEditor isLayoutEditor pageCode={data.layout} templates={data.templates} />
