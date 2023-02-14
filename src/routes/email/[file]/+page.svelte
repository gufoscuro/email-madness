<script lang="ts">
	import HtmlEditor from "$lib/components/HtmlEditor/HtmlEditor.svelte";
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Email Template</title>
</svelte:head>

<HtmlEditor pageCode={data.page} layoutCode={data.layout} templates={data.templates} file={data.file} />
