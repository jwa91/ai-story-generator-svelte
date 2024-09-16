<script lang="ts">
	import { getStory } from '$lib/stores/storyStatus';
	import { onMount } from 'svelte';
	import { getFromLocalStorage } from '$lib/utils/localStorageHelper';

	let storeData: string;
	let localStorageData: string;
	let showStore = true;
	let showInspector = true;

	onMount(() => {
		const unsubscribe = getStory().subscribe((value) => {
			storeData = JSON.stringify(value, null, 2);
		});

		updateLocalStorageData();

		return unsubscribe;
	});

	function updateLocalStorageData() {
		localStorageData = JSON.stringify(getFromLocalStorage('storyStatus', {}), null, 2);
	}

	function toggleView() {
		showStore = !showStore;
		if (!showStore) {
			updateLocalStorageData();
		}
	}

	function toggleInspector() {
		showInspector = !showInspector;
	}
</script>

<div class="store-inspector">
	<div class="inspector-header">
		<h3>Store Inspector</h3>
		<button on:click={toggleInspector}>
			{showInspector ? 'Hide' : 'Show'} Inspector
		</button>
	</div>

	{#if showInspector}
		<button on:click={toggleView}>
			Show {showStore ? 'LocalStorage' : 'Svelte Store'} Data
		</button>
		<div class="inspector-content">
			<pre>{showStore ? storeData : localStorageData}</pre>
		</div>
	{/if}
</div>

<style>
	.store-inspector {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 10px;
		margin-top: 20px;
		font-size: 12px;
	}

	.inspector-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.inspector-content {
		max-height: 300px;
		overflow-y: auto;
	}

	pre {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	button {
		margin-bottom: 10px;
	}
</style>
