<script lang="ts">
	import { createEventDispatcher, afterUpdate } from 'svelte';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import Spinner from '$lib/components/reader/spinner.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Download } from 'lucide-svelte';
	import type { ChapterStatus } from '$lib/types/story';

	export let options: { option: string; isSelected: boolean }[];
	export let selectedOption: string | undefined;
	export let chapterStatus: ChapterStatus;

	const dispatch = createEventDispatcher();

	let updateCounter = 0;

	function handleOptionClick(option: string) {
		selectedOption = option;
		dispatch('optionClick', option);
	}

	function handleBackToOverview() {
		dispatch('backToOverview');
	}

	function handleDownloadStory() {
		dispatch('downloadStory');
	}

	$: {
		options;
		selectedOption;
		updateCounter += 1;
	}

	afterUpdate(() => {
		console.log('Choices component updated:', {
			chapterStatus,
			options,
			selectedOption,
			updateCounter
		});
	});
</script>

{#if chapterStatus === 'final_chapter_generated'}
	<div class="flex flex-col items-center space-y-4">
		<p class="text-center text-xl font-bold">Verhaal afgelopen</p>
		<div class="w-full space-y-2">
			<Button variant="default" class="w-full" on:click={handleBackToOverview}>
				<ArrowLeft class="mr-2 h-4 w-4" />
				Terug naar overzicht
			</Button>
			<Button variant="secondary" class="w-full" on:click={handleDownloadStory}>
				<Download class="mr-2 h-4 w-4" />
				Download volledig verhaal
			</Button>
		</div>
	</div>
{:else if chapterStatus !== 'not_generated' && chapterStatus !== 'pending_content'}
	<div class="flex-grow rounded-lg bg-secondary p-4">
		{#if chapterStatus === 'generated' && options.length > 0}
			<RadioGroup bind:value={selectedOption} class="space-y-2">
				{#each options as option, index (option.option + updateCounter)}
					{#if option.option !== ''}
						<div class="flex items-center space-x-2">
							<RadioGroupItem
								value={option.option}
								id={`option-${index}-${updateCounter}`}
								class="h-6 min-h-6 w-6 min-w-6 rounded-full"
								on:click={() => handleOptionClick(option.option)}
							/>
							<Label for={`option-${index}-${updateCounter}`}>{option.option}</Label>
						</div>
					{/if}
				{/each}
			</RadioGroup>
		{:else}
			<div class="flex flex-col items-center space-y-4">
				<Spinner />
				<p class="text-center text-sm italic text-muted-foreground">
					De AI verhalenverteller is druk bezig met schrijven... Nog even geduld!
				</p>
			</div>
		{/if}
	</div>
{/if}
