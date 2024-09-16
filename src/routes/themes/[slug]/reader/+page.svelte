<script lang="ts">
	import {
		getStory,
		setSelectedOption,
		updateStep,
		getDefaultChapterStatus,
		triggerPendingContent,
		updateChapterById,
		triggerFinalChapterGenerated
	} from '$lib/stores/storyStatus';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import ProgressStepper from '$lib/components/reader/progressStepper.svelte';
	import Choices from '$lib/components/reader/choices.svelte';
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/reader/spinner.svelte';
	import { storyStore } from '$lib/stores/storyStore';
	import type { ChildData, StoryStatus, ChapterStatus } from '$lib/types/story';
	import {
		generatePrompt,
		generateChapter,
		generateChoices,
		generateImagePrompt,
		generateImage
	} from '$lib/utils/clientAPIutils';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	let selectedOption: string | undefined;
	let story: StoryStatus | undefined;
	let currentStep = 1;
	let totalChapters = 0;
	let chapterStatus: ChapterStatus = getDefaultChapterStatus();
	let chapterContent: string | undefined;
	let currentChapterImage: string | undefined;
	let chapterStatuses: ChapterStatus[] = [];
	let chapterOptions: { option: string; isSelected: boolean }[] = [];
	let settingId: string;
	let childData: ChildData;
	let isImageLoading = true;

	$: isNextButtonEnabled = chapterStatus === 'generated' && selectedOption !== undefined;
	$: showImage =
		chapterStatus === 'generated' ||
		chapterStatus === 'pending_choices' ||
		chapterStatus === 'final_chapter_generated';

	onMount(() => {
		const storyStatusStore = getStory();
		storyStatusStore.subscribe((value) => {
			story = value;
			if (story && story.totalChapters > 0) {
				totalChapters = story.totalChapters;
				chapterStatuses = story.chapters.map((chapter) => chapter.status);
				updateChapterInfo();
			}
		});

		storyStore.subscribeSettingId((value: string) => {
			settingId = value;
		});

		storyStore.subscribeChildData((value: ChildData) => {
			childData = value;
		});

		currentStep = 1;
		updateStep(currentStep);
		updateChapterInfo();
	});

	function updateChapterInfo() {
		if (story?.chapters[currentStep - 1]) {
			const currentChapter = story.chapters[currentStep - 1];
			chapterStatus = currentChapter.status;
			chapterContent = currentChapter.content;
			currentChapterImage = currentChapter.image;
			chapterOptions = [
				currentChapter.option_1,
				currentChapter.option_2,
				currentChapter.option_3
			].filter((option) => option.option !== '');
			selectedOption = chapterOptions.find((option) => option.isSelected)?.option || undefined;
		} else {
			chapterStatus = getDefaultChapterStatus();
			chapterContent = '';
			currentChapterImage = undefined;
			chapterOptions = [];
			selectedOption = undefined;
		}
		isImageLoading = !currentChapterImage;
	}

	function handleOptionClick(event: CustomEvent) {
		const chosenOption = event.detail;
		selectedOption = chosenOption;

		if (story?.chapters[currentStep - 1]) {
			const currentChapter = story.chapters[currentStep - 1];
			let optionKey: 'option_1' | 'option_2' | 'option_3' | undefined;

			if (currentChapter.option_1.option === chosenOption) {
				optionKey = 'option_1';
			} else if (currentChapter.option_2.option === chosenOption) {
				optionKey = 'option_2';
			} else if (currentChapter.option_3.option === chosenOption) {
				optionKey = 'option_3';
			}

			if (optionKey) {
				setSelectedOption(currentStep, chosenOption, optionKey);
			} else {
				console.error('Chosen option does not match available options');
			}
		} else {
			console.error('Current chapter not found');
		}
	}

	function handleStepChange(event: CustomEvent<number>) {
		currentStep = event.detail;
		updateStep(currentStep);
		updateChapterInfo();
	}

	function goToPreviousStep() {
		const newStep = Math.max(1, currentStep - 1);
		handleStepChange(new CustomEvent('stepChange', { detail: newStep }));
	}

	function goToNextStep() {
		const newStep = Math.min(totalChapters, currentStep + 1);
		handleStepChange(new CustomEvent('stepChange', { detail: newStep }));
	}

	async function handleGenerateClick() {
		try {
			// Start progress for the current step
			triggerPendingContent(currentStep);

			// Generate prompt based on the settingId, childData, and story
			const promptResult = await generatePrompt(settingId, childData, story);
			console.log('Generated prompt:', promptResult.prompt);

			// Generate the chapter using the generated prompt
			const chapterResult = await generateChapter(promptResult.prompt);
			updateChapterById(currentStep, {
				content: chapterResult.content,
				status: currentStep === totalChapters ? 'final_chapter_generated' : 'pending_choices'
			});

			// Update store with the new chapter content
			updateChapterInfo();

			// Start generating choices and the image in parallel
			const [choicesPromise, imagePromise] = await Promise.all([
				currentStep !== totalChapters ? generateChoices(chapterResult.content) : null,
				generateImagePrompt(chapterResult.content, settingId).then((imagePromptResult) => {
					console.log('Generated image prompt:', imagePromptResult.imagePrompt);

					// Call generateImage with the image prompt
					return generateImage(imagePromptResult.imagePrompt);
				})
			]);

			// Handle choices if not the final chapter
			if (currentStep !== totalChapters && choicesPromise) {
				const choicesResult = await choicesPromise;
				updateChapterById(currentStep, {
					option_1: { option: choicesResult.choices[0], isSelected: false },
					option_2: { option: choicesResult.choices[1], isSelected: false },
					option_3: { option: choicesResult.choices[2], isSelected: false }
				});
				// Update store with choices
				updateChapterInfo();
			}

			// Handle the image once it's generated
			const imageUrl = await imagePromise;
			console.log('Generated image URL:', imageUrl);
			updateChapterById(currentStep, {
				image: imageUrl
			});

			// Update store with image
			updateChapterInfo();

			if (currentStep === totalChapters) {
				triggerFinalChapterGenerated(currentStep);
			}
		} catch (error) {
			console.error('Error during API calls:', error);
			// TODO: Show an error message to the user
		}
	}

	function handleBackToOverview() {
		goto('/themes');
	}
</script>

<Card class="mx-auto w-full max-w-6xl">
	<ProgressStepper
		{totalChapters}
		{currentStep}
		{chapterStatuses}
		on:stepChange={handleStepChange}
	/>
	<CardContent class="p-6">
		<div class="min-h-[500px]">
			<div class="flex flex-col">
				<h2 class="mb-4 text-center text-2xl font-bold">Hoofdstuk {currentStep}</h2>
				{#if showImage && currentChapterImage}
					<div class="relative mx-auto mb-4 aspect-square w-full max-w-md">
						{#if isImageLoading}
							<div class="absolute inset-0 flex items-center justify-center">
								<Spinner />
								<p class="text-center text-sm italic text-muted-foreground">Afbeelding maken..</p>
							</div>
						{/if}
						<img
							src={currentChapterImage}
							alt={`Hoofdstuk ${currentStep}`}
							class="h-full w-full rounded-lg object-cover shadow-md"
							on:load={() => (isImageLoading = false)}
							transition:fade
						/>
					</div>
				{:else if chapterContent && !currentChapterImage}
					<div class="mx-auto mb-4 flex aspect-square w-full max-w-md items-center justify-center">
						<Spinner />
					</div>
				{/if}
				<div class="space-y-4 pb-4 text-foreground">
					{#if chapterStatus === 'pending_content'}
						<div class="flex flex-col items-center space-y-4">
							<Spinner />
							<p class="text-center text-sm italic text-muted-foreground">
								De AI verhalenverteller schrijft nu een nieuw hoofdstuk!
							</p>
						</div>
					{:else if chapterStatus === 'generated' || chapterStatus === 'pending_choices' || chapterStatus === 'final_chapter_generated'}
						{#if chapterContent}
							<p>{@html chapterContent.replace(/\n/g, '<br>')}</p>
						{:else}
							<p>Laden...</p>
						{/if}
					{:else if chapterStatus === 'not_generated'}
						<Button on:click={handleGenerateClick}>Genereer hoofdstuk</Button>
					{/if}
				</div>
			</div>
			<Separator class="my-4" />
			<div class="flex flex-col">
				<Choices
					options={chapterOptions}
					bind:selectedOption
					{chapterStatus}
					on:optionClick={handleOptionClick}
					on:backToOverview={handleBackToOverview}
				/>
			</div>
		</div>
	</CardContent>

	<CardFooter class="flex justify-between">
		<Button variant="outline" disabled={currentStep === 1} on:click={goToPreviousStep}>
			<ChevronLeft class="mr-2 h-4 w-4" /> Vorige
		</Button>
		<Button
			disabled={!isNextButtonEnabled || currentStep === totalChapters}
			on:click={goToNextStep}
		>
			Volgende <ChevronRight class="ml-2 h-4 w-4" />
		</Button>
	</CardFooter>
</Card>
