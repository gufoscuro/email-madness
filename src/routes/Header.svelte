<script>
	import { page } from '$app/stores';
</script>

<style>
	.HeadLink {
		@apply px-1;
		@apply py-2;
	}
	.HeadLink.active {
		@apply border-b-2;
		@apply border-solid;
		@apply border-blue-400;
	}
</style>

<div class="Header flex items-center h-16 px-4 fixed top-0 left-0 z-20 w-full">
	<div class="font-semibold text-white text-lg">Lovely Emails</div>
	<div class="h-full flex-grow flex items-center justify-end">
		<div class="mr-4">
			<a href="/layout" class="HeadLink" class:active={$page.url.pathname === '/layout'}>General Layout</a>
		</div>
		<div class="mr-4">
			<a href="/templates" class="HeadLink" class:active={$page.url.pathname === '/templates'}>Templates</a>
		</div>
		<div>
			<a href="/" class="HeadLink" class:active={$page.url.pathname === '/'}>Page</a>
		</div>
	</div>
</div>
