<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { isChapterClickable } from '$lib/stores/storyStatus';
	import type { ChapterStatus } from '$lib/types/story';

	export let totalChapters: number = 1;
	export let currentStep: number = 1;
	export let chapterStatuses: ChapterStatus[] = [];
	$: progressPercentage = ((currentStep - 1) / (totalChapters - 1)) * 100 + 1;

	const dispatch = createEventDispatcher();

	function handleStepClick(step: number) {
		if (isChapterClickable(chapterStatuses[step - 1])) {
			dispatch('stepChange', step);
		}
	}
</script>

<div class="flex flex-col items-center rounded-t-[1.25rem] bg-secondary p-4">
	<div class="mb-2 flex w-full justify-between space-x-2">
		{#each Array(totalChapters) as _, index}
			<Button
				variant="ghost"
				class="flex h-8 w-8 items-center justify-center rounded-full px-0 py-0 text-xs {currentStep ===
				index + 1
					? 'active'
					: ''} {isChapterClickable(chapterStatuses[index]) ? '' : 'cursor-not-allowed opacity-50'}"
				on:click={() => handleStepClick(index + 1)}
				disabled={!isChapterClickable(chapterStatuses[index])}
			>
				{index + 1}
			</Button>
		{/each}
	</div>
	<div class="w-full">
		<div class="h-2 w-full rounded-full bg-primary/20">
			<div
				class="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
				style="width: {progressPercentage}%"
			/>
		</div>
	</div>
</div>
