<script lang="ts">
	import CodeMirror from "../CodeMirror/CodeMirror.svelte";

	export let templateCode: string = '';
	export let layoutCode: string = '';
	export let isLayoutEditor: boolean = false;
	
	$: console.log ('isLayoutEditor', isLayoutEditor)
	$: console.log ('templateCode', templateCode.length)
	$: console.log ('layoutCode', layoutCode.length)
	
	let iframeHandle: any,
		timer: any,
		codemirrorInstance: any,
		editorCode: string = '',
		iframeCode: string = '';

	const onCodeEditorChange = (event: CustomEvent) => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}

		timer = setTimeout(() => {
			// console.log ('onChange', event.detail.value);
			editorCode = event.detail.value;
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

	const onSave = () => {
		let formData = new FormData();
		formData.append('data', iframeCode);
		fetch('?/save', {
			method: 'POST',
			headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json'
			},
			body: formData
		})
	}

	const onExport = () => {
		console.log ('onExport')
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
</script>

<div class="Editor flex h-full">
	<div class="w-3/5">
		<CodeMirror bind:this={codemirrorInstance} on:change={onCodeEditorChange} />
	</div>
	<div class="Renderer w-2/5">
		<div class="flex items-center justify-end py-1 px-1 border-solid border-b border-gray-200">
			<button class="button primary-button" on:click={onExport}>Export</button>
			<button class="button secondary-button" on:click={onSave}>Save Changes</button>
		</div>
		<iframe class="w-full h-full" title="renderer" bind:this={iframeHandle}> </iframe>
	</div>
</div>