<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { prompts } from '$lib/utils/testprompts';
	import { generateChapter, generateChoices, generateImagePrompt } from '$lib/utils/clientAPIutils';

	let prompt = '';
	let responseAnthropic = '';
	let responseOpenAI = '';
	let errorAnthropic = '';
	let errorOpenAI = '';
	let timeAnthropic: number | null = null;
	let timeOpenAI: number | null = null;
	let testAnthropic = true;
	let testOpenAI = true;
	let isLoading = false;

	let choicesPrompt = '';
	let choicesResponseAnthropic: string[] = [];
	let choicesResponseOpenAI: string[] = [];
	let choicesErrorAnthropic = '';
	let choicesErrorOpenAI = '';
	let choicesTimeAnthropic: number | null = null;
	let choicesTimeOpenAI: number | null = null;
	let testChoicesAnthropic = true;
	let testChoicesOpenAI = true;
	let isLoadingChoices = false;

	// New variables for generate-image-prompt
	let imagePromptChapter = '';
	let imagePromptResponseAnthropic = '';
	let imagePromptResponseOpenAI = '';
	let imagePromptErrorAnthropic = '';
	let imagePromptErrorOpenAI = '';
	let imagePromptTimeAnthropic: number | null = null;
	let imagePromptTimeOpenAI: number | null = null;
	let testImagePromptAnthropic = true;
	let testImagePromptOpenAI = true;
	let isLoadingImagePrompt = false;

	function setPromptFirstChapter() {
		prompt = prompts.firstChapter;
	}

	function setPromptSecondChapter() {
		prompt = prompts.secondChapter;
	}

	async function handleSubmit() {
		errorAnthropic = '';
		errorOpenAI = '';
		responseAnthropic = '';
		responseOpenAI = '';
		timeAnthropic = null;
		timeOpenAI = null;

		if (!prompt.trim()) {
			alert('Voer alstublieft een prompt in.');
			return;
		}

		if (!testAnthropic && !testOpenAI) {
			alert('Selecteer alstublieft ten minste één API om te testen.');
			return;
		}

		isLoading = true;

		const requests: Promise<void>[] = [];

		if (testAnthropic) {
			const anthropicRequest = (async () => {
				const startAnthropic = performance.now();
				try {
					const data = await generateChapter(prompt);
					const endAnthropic = performance.now();
					timeAnthropic = endAnthropic - startAnthropic;
					responseAnthropic = data.content;
				} catch (e) {
					const endAnthropic = performance.now();
					timeAnthropic = endAnthropic - startAnthropic;
					errorAnthropic = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(anthropicRequest);
		}

		if (testOpenAI) {
			const openAIRequest = (async () => {
				const startOpenAI = performance.now();
				try {
					const data = await generateChapter(prompt);
					const endOpenAI = performance.now();
					timeOpenAI = endOpenAI - startOpenAI;
					responseOpenAI = data.content;
				} catch (e) {
					const endOpenAI = performance.now();
					timeOpenAI = endOpenAI - startOpenAI;
					errorOpenAI = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(openAIRequest);
		}

		await Promise.all(requests);
		isLoading = false;
	}

	async function handleChoicesSubmit() {
		choicesErrorAnthropic = '';
		choicesErrorOpenAI = '';
		choicesResponseAnthropic = [];
		choicesResponseOpenAI = [];
		choicesTimeAnthropic = null;
		choicesTimeOpenAI = null;

		if (!choicesPrompt.trim()) {
			alert('Voer alstublieft een prompt in voor het genereren van keuzes.');
			return;
		}

		if (!testChoicesAnthropic && !testChoicesOpenAI) {
			alert('Selecteer alstublieft ten minste één API om te testen voor het genereren van keuzes.');
			return;
		}

		isLoadingChoices = true;

		const requests: Promise<void>[] = [];

		if (testChoicesAnthropic) {
			const anthropicRequest = (async () => {
				const startAnthropic = performance.now();
				try {
					const data = await generateChoices(choicesPrompt);
					const endAnthropic = performance.now();
					choicesTimeAnthropic = endAnthropic - startAnthropic;
					choicesResponseAnthropic = data.choices;
				} catch (e) {
					const endAnthropic = performance.now();
					choicesTimeAnthropic = endAnthropic - startAnthropic;
					choicesErrorAnthropic = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(anthropicRequest);
		}

		if (testChoicesOpenAI) {
			const openAIRequest = (async () => {
				const startOpenAI = performance.now();
				try {
					const data = await generateChoices(choicesPrompt);
					const endOpenAI = performance.now();
					choicesTimeOpenAI = endOpenAI - startOpenAI;
					choicesResponseOpenAI = data.choices;
				} catch (e) {
					const endOpenAI = performance.now();
					choicesTimeOpenAI = endOpenAI - startOpenAI;
					choicesErrorOpenAI = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(openAIRequest);
		}

		await Promise.all(requests);
		isLoadingChoices = false;
	}

	// New function to handle generate-image-prompt submission
	async function handleImagePromptSubmit() {
		imagePromptErrorAnthropic = '';
		imagePromptErrorOpenAI = '';
		imagePromptResponseAnthropic = '';
		imagePromptResponseOpenAI = '';
		imagePromptTimeAnthropic = null;
		imagePromptTimeOpenAI = null;

		if (!imagePromptChapter.trim()) {
			alert('Voer alstublieft een hoofdstuk in voor het genereren van een afbeeldingsprompt.');
			return;
		}

		if (!testImagePromptAnthropic && !testImagePromptOpenAI) {
			alert(
				'Selecteer alstublieft ten minste één API om te testen voor het genereren van afbeeldingsprompts.'
			);
			return;
		}

		isLoadingImagePrompt = true;

		const requests: Promise<void>[] = [];

		if (testImagePromptAnthropic) {
			const anthropicRequest = (async () => {
				const startAnthropic = performance.now();
				try {
					const data = await generateImagePrompt(imagePromptChapter);
					const endAnthropic = performance.now();
					imagePromptTimeAnthropic = endAnthropic - startAnthropic;
					imagePromptResponseAnthropic = data.imagePrompt;
				} catch (e) {
					const endAnthropic = performance.now();
					imagePromptTimeAnthropic = endAnthropic - startAnthropic;
					imagePromptErrorAnthropic = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(anthropicRequest);
		}

		if (testImagePromptOpenAI) {
			const openAIRequest = (async () => {
				const startOpenAI = performance.now();
				try {
					const data = await generateImagePrompt(imagePromptChapter);
					const endOpenAI = performance.now();
					imagePromptTimeOpenAI = endOpenAI - startOpenAI;
					imagePromptResponseOpenAI = data.imagePrompt;
				} catch (e) {
					const endOpenAI = performance.now();
					imagePromptTimeOpenAI = endOpenAI - startOpenAI;
					imagePromptErrorOpenAI = e instanceof Error ? e.message : 'Onbekende fout';
				}
			})();

			requests.push(openAIRequest);
		}

		await Promise.all(requests);
		isLoadingImagePrompt = false;
	}
</script>

<h1 class="mb-4 text-2xl font-bold">LLM API Testpagina</h1>

<div class="space-y-4">
	<h2 class="text-xl font-semibold">Genereer Hoofdstuk</h2>
	<div>
		<Label for="prompt">Prompt:</Label>
		<Textarea id="prompt" bind:value={prompt} rows={10} class="mt-1" disabled={isLoading} />
	</div>
	<div class="flex space-x-2">
		<Button on:click={setPromptFirstChapter} type="button" disabled={isLoading}>
			Genereer Eerste Hoofdstuk
		</Button>
		<Button on:click={setPromptSecondChapter} type="button" disabled={isLoading}>
			Genereer Tweede Hoofdstuk
		</Button>
	</div>
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<Checkbox id="anthropic" bind:checked={testAnthropic} disabled={isLoading} />
			<Label for="anthropic">Test Anthropic API</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="openai" bind:checked={testOpenAI} disabled={isLoading} />
			<Label for="openai">Test OpenAI API</Label>
		</div>
	</div>

	<Button on:click={handleSubmit} disabled={isLoading}>
		{isLoading ? 'Bezig met laden...' : 'Verstuur'}
	</Button>
</div>

<div class="mt-8 space-y-4">
	<h2 class="text-xl font-semibold">Genereer Keuzes</h2>
	<div>
		<Label for="choicesPrompt">Prompt voor keuzes:</Label>
		<Textarea
			id="choicesPrompt"
			bind:value={choicesPrompt}
			rows={5}
			class="mt-1"
			disabled={isLoadingChoices}
		/>
	</div>
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<Checkbox
				id="choicesAnthropic"
				bind:checked={testChoicesAnthropic}
				disabled={isLoadingChoices}
			/>
			<Label for="choicesAnthropic">Test Anthropic API voor keuzes</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="choicesOpenai" bind:checked={testChoicesOpenAI} disabled={isLoadingChoices} />
			<Label for="choicesOpenai">Test OpenAI API voor keuzes</Label>
		</div>
	</div>

	<Button on:click={handleChoicesSubmit} disabled={isLoadingChoices}>
		{isLoadingChoices ? 'Bezig met laden...' : 'Genereer Keuzes'}
	</Button>
</div>

<div class="mt-8 space-y-4">
	<h2 class="text-xl font-semibold">Genereer Afbeeldingsprompt</h2>
	<div>
		<Label for="imagePromptChapter">Hoofdstuk voor afbeeldingsprompt:</Label>
		<Textarea
			id="imagePromptChapter"
			bind:value={imagePromptChapter}
			rows={5}
			class="mt-1"
			disabled={isLoadingImagePrompt}
		/>
	</div>
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<Checkbox
				id="imagePromptAnthropic"
				bind:checked={testImagePromptAnthropic}
				disabled={isLoadingImagePrompt}
			/>
			<Label for="imagePromptAnthropic">Test Anthropic API voor afbeeldingsprompt</Label>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox
				id="imagePromptOpenai"
				bind:checked={testImagePromptOpenAI}
				disabled={isLoadingImagePrompt}
			/>
			<Label for="imagePromptOpenai">Test OpenAI API voor afbeeldingsprompt</Label>
		</div>
	</div>

	<Button on:click={handleImagePromptSubmit} disabled={isLoadingImagePrompt}>
		{isLoadingImagePrompt ? 'Bezig met laden...' : 'Genereer Afbeeldingsprompt'}
	</Button>
</div>

<h2 class="mt-8 text-xl font-semibold">Resultaten</h2>

<div class="mt-4 space-y-6">
	{#if testAnthropic}
		<Card>
			<CardHeader>
				<CardTitle>Anthropic API - Hoofdstuk</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {timeAnthropic !== null ? `${timeAnthropic.toFixed(2)} ms` : 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if errorAnthropic}
					<p class="font-semibold text-destructive">Foutmelding: {errorAnthropic}</p>
				{:else if responseAnthropic}
					<pre class="whitespace-pre-wrap">{responseAnthropic}</pre>
				{/if}
			</CardContent>
		</Card>
	{/if}

	{#if testOpenAI}
		<Card>
			<CardHeader>
				<CardTitle>OpenAI API - Hoofdstuk</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {timeOpenAI !== null ? `${timeOpenAI.toFixed(2)} ms` : 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if errorOpenAI}
					<p class="font-semibold text-destructive">Foutmelding: {errorOpenAI}</p>
				{:else if responseOpenAI}
					<pre class="whitespace-pre-wrap">{responseOpenAI}</pre>
				{/if}
			</CardContent>
		</Card>
	{/if}

	{#if testChoicesAnthropic}
		<Card>
			<CardHeader>
				<CardTitle>Anthropic API - Keuzes</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {choicesTimeAnthropic !== null
						? `${choicesTimeAnthropic.toFixed(2)} ms`
						: 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if choicesErrorAnthropic}
					<p class="font-semibold text-destructive">Foutmelding: {choicesErrorAnthropic}</p>
				{:else if choicesResponseAnthropic.length > 0}
					<ul class="list-inside list-disc">
						{#each choicesResponseAnthropic as choice}
							<li>{choice}</li>
						{/each}
					</ul>
				{/if}
			</CardContent>
		</Card>
	{/if}

	{#if testChoicesOpenAI}
		<Card>
			<CardHeader>
				<CardTitle>OpenAI API - Keuzes</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {choicesTimeOpenAI !== null ? `${choicesTimeOpenAI.toFixed(2)} ms` : 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if choicesErrorOpenAI}
					<p class="font-semibold text-destructive">Foutmelding: {choicesErrorOpenAI}</p>
				{:else if choicesResponseOpenAI.length > 0}
					<ul class="list-inside list-disc">
						{#each choicesResponseOpenAI as choice}
							<li>{choice}</li>
						{/each}
					</ul>
				{/if}
			</CardContent>
		</Card>
	{/if}

	{#if testImagePromptAnthropic}
		<Card>
			<CardHeader>
				<CardTitle>Anthropic API - Afbeeldingsprompt</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {imagePromptTimeAnthropic !== null
						? `${imagePromptTimeAnthropic.toFixed(2)} ms`
						: 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if imagePromptErrorAnthropic}
					<p class="font-semibold text-destructive">Foutmelding: {imagePromptErrorAnthropic}</p>
				{:else if imagePromptResponseAnthropic}
					<pre class="whitespace-pre-wrap">{imagePromptResponseAnthropic}</pre>
				{/if}
			</CardContent>
		</Card>
	{/if}

	{#if testImagePromptOpenAI}
		<Card>
			<CardHeader>
				<CardTitle>OpenAI API - Afbeeldingsprompt</CardTitle>
				<p class="text-sm text-muted-foreground">
					Responstijd: {imagePromptTimeOpenAI !== null
						? `${imagePromptTimeOpenAI.toFixed(2)} ms`
						: 'N/B'}
				</p>
			</CardHeader>
			<CardContent>
				{#if imagePromptErrorOpenAI}
					<p class="font-semibold text-destructive">Foutmelding: {imagePromptErrorOpenAI}</p>
				{:else if imagePromptResponseOpenAI}
					<pre class="whitespace-pre-wrap">{imagePromptResponseOpenAI}</pre>
				{/if}
			</CardContent>
		</Card>
	{/if}
</div>
