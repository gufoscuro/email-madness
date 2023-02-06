<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>
</div>

<style global>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding-top: 64px;
	}
	main {
		height: calc(100vh - 64px)
	}
	
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
