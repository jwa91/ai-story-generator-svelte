<script lang="ts">
	import {
		getStory,
		updateChapterById,
		updateStory,
		updateStep,
		setSelectedOption,
		addOptionToChapter,
		updateStoryId
	} from '$lib/stores/storyStatus';
	import type { StoryStatus, StoryChapter } from '$lib/types/story';

	let story: StoryStatus;
	let selectedChapter: number = 1;

	const storyStore = getStory();
	storyStore.subscribe((value) => {
		story = value;
		if (selectedChapter > story.totalChapters) {
			selectedChapter = story.totalChapters;
		}
	});

	type OptionKey = 'option_1' | 'option_2' | 'option_3';
	const optionKeys: OptionKey[] = ['option_1', 'option_2', 'option_3'];

	const handleUpdateTotalChapters = () => {
		updateStory({ totalChapters: story.totalChapters });
	};

	const handleUpdateChapterContent = () => {
		if (story.chapters[selectedChapter - 1]) {
			updateChapterById(selectedChapter, { content: story.chapters[selectedChapter - 1].content });
		}
	};

	const handleSetActiveChapter = () => {
		updateStep(selectedChapter);
	};

	const handleSetOption = (optionKey: OptionKey) => {
		if (story.chapters[selectedChapter - 1]) {
			const optionValue = story.chapters[selectedChapter - 1][optionKey].option;
			setSelectedOption(selectedChapter, optionValue, optionKey);
		}
	};

	const handleAddOption = (optionKey: OptionKey) => {
		if (story.chapters[selectedChapter - 1]) {
			const newOption = story.chapters[selectedChapter - 1][optionKey].option;
			addOptionToChapter(selectedChapter, optionKey, newOption);
		}
	};

	const isOptionSelected = (chapter: StoryChapter, optionKey: OptionKey): string => {
		return chapter[optionKey].isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary';
	};

	const handleChapterSelection = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		selectedChapter = parseInt(target.value, 10);
	};

	const handleUpdateStoryId = () => {
		updateStoryId(story.storyId);
	};

	const deleteChapter = () => {
		const newTotalChapters = story.totalChapters - 1;
		updateStory({ totalChapters: newTotalChapters });
	};

	const deleteStory = () => {
		updateStory({ storyId: '', totalChapters: 0, chapters: [] });
	};
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8 rounded-lg bg-card p-6 text-card-foreground shadow-md">
		<h2 class="mb-4 text-2xl font-semibold">Story Overview</h2>
		<div class="mb-4 flex items-center">
			<label for="story-id" class="mr-2">Story ID:</label>
			<input
				id="story-id"
				type="text"
				bind:value={story.storyId}
				on:change={handleUpdateStoryId}
				class="w-64 rounded border px-2 py-1"
			/>
		</div>
		<div class="mb-4 flex items-center">
			<label for="total-chapters" class="mr-2">Total Chapters:</label>
			<input
				id="total-chapters"
				type="number"
				min="1"
				bind:value={story.totalChapters}
				on:change={handleUpdateTotalChapters}
				class="w-20 rounded border px-2 py-1"
			/>
		</div>

		<div class="chapter-selector">
			<label for="chapter-select" class="mb-2 block">Select Chapter:</label>
			<select
				id="chapter-select"
				bind:value={selectedChapter}
				on:change={handleChapterSelection}
				class="w-full rounded border px-2 py-1"
			>
				{#each story.chapters as chapter (chapter.chapterNumber)}
					<option value={chapter.chapterNumber}>Chapter {chapter.chapterNumber}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="rounded-lg bg-card p-6 text-card-foreground shadow-md">
		{#if story.chapters.length > 0 && story.chapters[selectedChapter - 1]}
			<h2 class="mb-4 text-2xl font-semibold">
				Editing Chapter {selectedChapter}
				{#if story.chapters[selectedChapter - 1].isActive}
					<span class="ml-2 rounded-full bg-green-500 px-2 py-1 text-sm text-white">Active</span>
				{/if}
			</h2>
			<label for="chapter-content" class="mb-2 block">Current Content:</label>
			<textarea
				id="chapter-content"
				bind:value={story.chapters[selectedChapter - 1].content}
				on:change={handleUpdateChapterContent}
				class="mb-4 h-40 w-full rounded border px-3 py-2"
			/>

			<h3 class="mb-4 text-xl font-semibold">Options</h3>
			{#each optionKeys as optionKey, index}
				<div class="mb-4">
					<label for={`option-${index + 1}`} class="mb-2 block">{optionKey}</label>
					<div class="flex items-center">
						<input
							id={`option-${index + 1}`}
							type="text"
							bind:value={story.chapters[selectedChapter - 1][optionKey].option}
							on:change={() => handleAddOption(optionKey)}
							placeholder="Option content"
							class="mr-2 flex-grow rounded border px-3 py-2"
						/>
						<button
							on:click={() => handleSetOption(optionKey)}
							class="rounded bg-secondary px-4 py-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
						>
							Set Selected
						</button>
					</div>
					<span
						class={`mt-2 inline-block rounded px-2 py-1 text-sm ${isOptionSelected(
							story.chapters[selectedChapter - 1],
							optionKey
						)}`}
					>
						{story.chapters[selectedChapter - 1][optionKey].isSelected
							? 'Selected'
							: 'Not Selected'}
					</span>
				</div>
			{/each}

			<div class="mt-4 flex space-x-4">
				<button
					on:click={handleSetActiveChapter}
					class="rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/80"
				>
					Set Active Chapter
				</button>
				<button
					on:click={deleteChapter}
					class="rounded bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/80"
				>
					Delete Chapter
				</button>
			</div>
		{:else}
			<p class="text-muted-foreground">
				No chapters available. Please add some chapters to the story.
			</p>
		{/if}
	</div>

	<div class="mt-8">
		<button
			on:click={deleteStory}
			class="rounded bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/80"
		>
			Delete Story
		</button>
	</div>
</div>
