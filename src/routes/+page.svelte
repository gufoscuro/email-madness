<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="font-bold text-lg p-4 underline">Available Templates:</div>
{#each data.files as file}
	<a href={'/email/' + file} class="block px-4 py-2 hover:bg-gray-600">
		{file}
	</a>
{/each}
