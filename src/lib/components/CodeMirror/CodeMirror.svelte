<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import './codemirror.css';

	const dispatch = createEventDispatcher();

	export let readonly = false;
	export let errorLoc = null;
	export let flex = false;
	export let lineNumbers = true;
	export let tab = true;
	export let theme = 'material';
	export let name = 'dumb';
	export let field = null;

	let w;
	let h;
	let code = '';
	let mode;

	// We have to expose set and update methods, rather
	// than making this state-driven through props,
	// because it's difficult to update an editor
	// without resetting scroll otherwise
	export async function set(new_code, new_mode) {
		if (new_mode !== mode) {
			mode = new_mode;
			await createEditor(mode);
		}

		code = new_code;
		updating_externally = true;
		if (editor) editor.setValue(code);
		updating_externally = false;
	}

	export function update(new_code) {
		code = new_code;

		if (editor) {
			updating_externally = true;
			const { left, top } = editor.getScrollInfo();
			editor.setValue((code = new_code));
			editor.scrollTo(left, top);
			updating_externally = false;
		}
	}

	export async function setMode(new_mode) {
		if (new_mode !== mode) {
			await createEditor((mode = new_mode));
		}
	}

	export function triggerChange() {
		if (editor) {
			editor.setValue(editor.getValue());
		}
	}

	export function resize() {
		if (editor) {
			editor.refresh();
		}
	}

	export function focus() {
		editor.focus();
	}

	export function getHistory() {
		return editor.getHistory();
	}

	export function setHistory(history) {
		editor.setHistory(history);
	}

	export function clearHistory() {
		if (editor) editor.clearHistory();
	}

	export function getValue() {
		if (editor) {
			return editor.getValue();
		}
	}

	export function posFromIndex(index) {
		if (editor) {
			return index !== -1 ? editor.posFromIndex(index) : null;
		}
	}

	function updateTheme(nextTheme) {
		if (editor) editor.setOption('theme', theme);
	}

	const modes = {
		js: {
			name: 'javascript',
			json: false
		},
		json: {
			name: 'javascript',
			json: true
		},
		yaml: {
			name: 'yaml'
		},
		xml: {
			name: 'text/html'
		},
		svelte: {
			name: 'handlebars',
			base: 'text/html'
		},
		md: {
			name: 'markdown'
		}
	};

	const refs = {};
	let editor;
	let updating_externally = false;
	let marker;
	let markers = [];
	let error_line;
	let destroyed = false;
	let CodeMirror;

	const addMarkers = markerList => {
		if (markers.length) {
			markers.forEach(it => editor.removeLineClass(it, 'wrap', 'error-line'));
			markers = [];
		}
		if (markerList) {
			markerList.forEach(it => {
				markers.push(it.line);
				editor.addLineClass(it.line, 'wrap', 'error-line');
			});
		}
	};

	$: if (editor && w && h) {
		editor.refresh();
	}

	$: if (editor) {
		addMarkers(errorLoc);
	}
	// $: {
	// 	if (marker) marker.clear();

	// 	if (errorLoc) {
	// 		const line = errorLoc.line - 1;
	// 		const ch = errorLoc.column;

	// 		marker = editor.markText({ line, ch }, { line, ch: ch + 1 }, {
	// 			className: 'error-loc'
	// 		});

	// 		error_line = line;
	// 	} else {
	// 		error_line = null;
	// 	}
	// }

	// let previous_error_line;
	// $: if (editor) {
	// 	if (previous_error_line != null) {
	// 		editor.removeLineClass(previous_error_line, 'wrap', 'error-line')
	// 		previous_error_line = null
	// 	}

	// 	if (error_line && (error_line !== previous_error_line)) {
	// 		editor.addLineClass(error_line, 'wrap', 'error-line');
	// 		previous_error_line = error_line;
	// 	}
	// }

	$: updateTheme(theme);

	onMount(() => {
		(async () => {
			if (!CodeMirror) {
				let mod = await import('./codemirror.js');
				CodeMirror = mod.default;
			}
			await createEditor(mode || 'svelte');
			if (editor) editor.setValue(code || '');
		})();

		return () => {
			destroyed = true;
			if (editor) editor.toTextArea();
		};
	});

	let first = true;

	async function createEditor(mode) {
		if (destroyed || !CodeMirror) return;

		if (editor) editor.toTextArea();

		const opts = {
			theme,
			styleActiveLine: true,
			lineNumbers,
			lineWrapping: true,
			indentWithTabs: tab,
			indentUnit: 4,
			tabSize: 4,
			value: '',
			mode: modes[mode] || {
				name: mode
			},
			readOnly: readonly,
			autoCloseBrackets: true,
			autoCloseTags: true,
			extraKeys: {
				Enter: 'newlineAndIndentContinueMarkdownList',
				'Ctrl-/': 'toggleComment',
				'Cmd-/': 'toggleComment',
				'Ctrl-Q': function (cm) {
					cm.foldCode(cm.getCursor());
				},
				'Cmd-Q': function (cm) {
					cm.foldCode(cm.getCursor());
				}
			},
			foldGutter: true,
			gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
		};

		if (!tab) {
			opts.extraKeys['Tab'] = tab;
			opts.extraKeys['Shift-Tab'] = tab;
		}

		// Creating a text editor is a lot of work, so we yield
		// the main thread for a moment. This helps reduce jank
		if (first) await sleep(50);

		if (destroyed) return;

		editor = CodeMirror.fromTextArea(field, opts);

		editor.on('change', instance => {
			if (!updating_externally) {
				const value = instance.getValue();
				dispatch('change', { value, textarea: field });
			}
		});

		if (first) await sleep(50);
		editor.refresh();

		first = false;
	}

	function sleep(ms) {
		return new Promise(fulfil => setTimeout(fulfil, ms));
	}
</script>

<style>
	.codemirror-container {
		position: relative;
		width: 100%;
		height: 100%;
		border: none;
		line-height: 1.5;
		overflow: hidden;
	}

	.codemirror-container :global(.CodeMirror) {
		height: 100%;
		/* background: transparent;
		font: 400 14px/1.7 var(--font-mono); */
	}

	.codemirror-container.flex :global(.CodeMirror) {
		height: auto;
	}

	.codemirror-container.flex :global(.CodeMirror-lines) {
		padding: 0;
	}

	.codemirror-container :global(.CodeMirror-gutters) {
		padding: 0 16px 0 8px;
		border: none;
	}

	.codemirror-container :global(.error-loc) {
		position: relative;
		border-bottom: 2px solid #da106e;
	}

	.codemirror-container :global(.error-line) {
		background-color: #fd4a4a75;
	}
	.codemirror-container :global(.error-line .CodeMirror-activeline-background) {
		background: none;
	}

	textarea {
		visibility: hidden;
	}

	.flex pre {
		padding: 0 0 0 4px;
		height: auto;
	}
</style>

<div class="codemirror-container {$$restProps.class}" class:flex bind:offsetWidth={w} bind:offsetHeight={h}>
	<!-- svelte-ignore a11y-positive-tabindex -->
	<textarea tabindex="2" bind:this={field} readonly {name} value={code} />

	{#if !CodeMirror}
		<pre style="position: absolute; left: 0; top: 0">{code}</pre>

		<div style="position: absolute; width: 100%; bottom: 0">
			<div>loading editor...</div>
		</div>
	{/if}
</div>
