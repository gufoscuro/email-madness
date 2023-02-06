<script lang="ts">
	import CodeMirror from "../CodeMirror/CodeMirror.svelte";

	export let templateCode: string = '';
	export let layoutCode: string = '';
	export let isLayoutEditor: boolean = false;
	
	let iframeHandle: any,
		timer: any,
		codemirrorInstance: any,
		editorCode: string = '',
		iframeCode: string = '',
		editorCodeUntouched: string = '',
		firstLoad: boolean = false,
		saveBusy: boolean = false;

	const onCodeEditorChange = (event: CustomEvent) => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		timer = setTimeout(() => {
			// console.log ('onChange', event.detail.value);
			editorCode = event.detail.value;
			if (firstLoad === false) {
				firstLoad = true;
				editorCodeUntouched = editorCode;
			}
		}, 500);
	}

	const updateIframe = (content: string) => {
		// console.log ('updateIframe', content)
		const iframedoc = iframeHandle.contentDocument || iframeHandle.contentWindow.document;
		if (iframedoc) {
			iframeCode = content;
			if (content.trim() === '') {
				iframedoc.documentElement.innerHTML = '<div style="height: 100vh; width: 100%; text-align: center; display: flex; align-items: center;justify-content: center;font-family: sans-serif;"><div>Your content will appear here</div></div>';
			} else {
				iframedoc.documentElement.innerHTML = content;
			}
		}
	}

	const injectInLayout = (data: string) => {
		// console.log ('injectInLayout', layoutCode !== '', layoutCode.replace(/{{template}}/g, data))
		return layoutCode !== '' ? layoutCode.replace(/{{template}}/g, data) : data;
	}

	const onSave = async () => {
		saveBusy = true;
		let formData = new FormData();
		formData.append('data', editorCode);
		await fetch('?/save', {
			method: 'POST',
			headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json'
			},
			body: formData
		});
		editorCodeUntouched = editorCode;
		saveBusy = false;
	}

	const downloadFile = (data: string, filename: string) => {
		const a = document.createElement ('a');
		const blobUrl = URL.createObjectURL (new Blob([ data ], { type: 'text/plain' }));
		document.body.appendChild (a);
		a.href = blobUrl;
		a.download = filename;
		a.click ();
		setTimeout (() => {
			URL.revokeObjectURL (blobUrl);
			document.body.removeChild (a);
		}, 0)
	}

	const onExport = () => {
		downloadFile(iframeCode, 'template.txt')
	}

	const getIframeContent = (data: string) => {
		return isLayoutEditor ? data : injectInLayout(editorCode)
	}

	const onLoad = (data: string) => {
		// console.log ('onLoad', data)
		editorCode = data;
		codemirrorInstance.update(editorCode);
		updateIframe(getIframeContent(editorCode));
	}

	$: if (iframeHandle && templateCode) {
		onLoad(templateCode);
	}

	$: if (iframeHandle) updateIframe(getIframeContent(editorCode));
	$: saveEnabled = editorCode !== editorCodeUntouched;
</script>

<div class="Editor h-full">
	<div class="flex items-center justify-start px-1 h-12">
		{#if saveEnabled}
			<button class="button secondary-button" disabled={saveBusy} on:click={onSave}>Save Changes</button>
		{/if}
		{#if !isLayoutEditor}
			<button class="button primary-button" on:click={onExport}>Export</button>
		{/if}
	</div>
	<div class="flex EditorViews">
		<div class="w-1/2 text-xs">
			<CodeMirror bind:this={codemirrorInstance} on:change={onCodeEditorChange} />
		</div>
		<div class="Renderer w-1/2">
			<iframe class="w-full h-full" title="renderer" bind:this={iframeHandle}> </iframe>
		</div>
	</div>
</div>

<style>
	.EditorViews {
		height: calc(100% - 48px);
	}
</style>