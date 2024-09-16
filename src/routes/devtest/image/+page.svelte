<script lang="ts">
	import { onMount } from 'svelte';
	import { generateImage } from '$lib/utils/clientAPIutils';

	let imageUrl: string | null = null;
	let error: string | null = null;
	let prompt: string = '';
	let isLoading = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = null;
		imageUrl = null;

		try {
			imageUrl = await generateImage(prompt);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Replicate + Svelte</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
	<div
		class="z-10 flex w-full max-w-5xl flex-col items-center justify-between rounded-3xl border-2 border-solid border-gray-300 bg-white p-10 font-mono text-sm lg:flex"
	>
		<p class="mb-4 text-lg text-gray-700">
			Dream something with
			<a
				href="https://replicate.com/black-forest-labs/flux-schnell"
				class="text-blue-500 hover:underline"
			>
				Flux Schnell
			</a>:
		</p>

		<form on:submit={handleSubmit} class="flex w-full flex-col items-center">
			<input
				type="text"
				bind:value={prompt}
				placeholder="Enter a prompt to display an image"
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				class="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
				disabled={isLoading}
			>
				{isLoading ? 'Generating...' : 'Go!'}
			</button>
		</form>

		{#if error}
			<div class="mt-4 text-red-500">{error}</div>
		{/if}

		{#if imageUrl}
			<div class="mt-4">
				<div class="flex w-full flex-col items-center justify-center">
					<img
						src={imageUrl}
						alt="Generated based on the provided prompt"
						class="w-500 h-500 rounded-md border-gray-300 object-cover"
					/>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		background-color: #f3f4f6;
	}
</style>
