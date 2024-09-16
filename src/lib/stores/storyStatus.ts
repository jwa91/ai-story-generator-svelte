import { writable } from 'svelte/store';
import {
	getFromLocalStorage,
	setToLocalStorage,
	removeFromLocalStorage
} from '$lib/utils/localStorageHelper';
import type { ChapterStatus, StoryChapter, StoryStatus } from '$lib/types/story';

// Constants
const LOCAL_STORAGE_KEY = 'storyStatus';

// Initial Store Value
const initialStory: StoryStatus = getFromLocalStorage<StoryStatus>(LOCAL_STORAGE_KEY, {
	storyId: '',
	totalChapters: 0,
	chapters: []
});

// Svelte Store
const storyContentStore = writable<StoryStatus>(initialStory);

// Subscribe to store and persist changes in Local Storage
storyContentStore.subscribe((value) => {
	setToLocalStorage(LOCAL_STORAGE_KEY, value);
});

// Helper Functions
const updateChapterStatus = (chapter: StoryChapter): void => {
	if (chapter.status === 'final_chapter_generated') {
		return;
	}

	const hasContent = chapter.content.trim() !== '';
	const optionsPresent = [chapter.option_1, chapter.option_2, chapter.option_3].filter(
		(opt) => opt.option !== ''
	);

	if (hasContent && optionsPresent.length === 3) {
		chapter.status = 'generated';
	} else if (hasContent) {
		chapter.status = 'pending_choices';
	}
};

const createNewChapter = (chapterNumber: number): StoryChapter => ({
	chapterNumber,
	content: '',
	option_1: { option: '', isSelected: false },
	option_2: { option: '', isSelected: false },
	option_3: { option: '', isSelected: false },
	isActive: chapterNumber === 1,
	status: 'not_generated',
	image: '' // New property with default value
});

const updateChapter = (chapter: StoryChapter, updates: Partial<StoryChapter>): StoryChapter => {
	const updatedChapter = { ...chapter, ...updates };
	updateChapterStatus(updatedChapter);
	return updatedChapter;
};

const updateChapterOption = (
	chapter: StoryChapter,
	optionKey: keyof Pick<StoryChapter, 'option_1' | 'option_2' | 'option_3'>,
	newOption: string,
	isSelected: boolean = false
): StoryChapter => {
	const updatedChapter = {
		...chapter,
		[optionKey]: { option: newOption, isSelected },
		option_1: { ...chapter.option_1, isSelected: optionKey === 'option_1' && isSelected },
		option_2: { ...chapter.option_2, isSelected: optionKey === 'option_2' && isSelected },
		option_3: { ...chapter.option_3, isSelected: optionKey === 'option_3' && isSelected }
	};
	updateChapterStatus(updatedChapter);
	return updatedChapter;
};

// Store Update Functions
const updateStoryContent = (updater: (story: StoryStatus) => StoryStatus): void => {
	storyContentStore.update(updater);
};

export const getStory = () => storyContentStore;

export const getDefaultChapterStatus = (): ChapterStatus => 'not_generated';

export const isChapterClickable = (chapterStatus: ChapterStatus): boolean =>
	chapterStatus === 'generated' ||
	chapterStatus === 'pending_choices' ||
	chapterStatus === 'final_chapter_generated' ||
	chapterStatus === 'pending_content';

export const updateChapterById = (chapterNumber: number, updates: Partial<StoryChapter>): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) =>
			chapter.chapterNumber === chapterNumber ? updateChapter(chapter, updates) : chapter
		)
	}));
};

export const updateStory = (updates: Partial<StoryStatus>): void => {
	updateStoryContent((story) => {
		const updatedStory = { ...story, ...updates };
		const { totalChapters } = updatedStory;

		updatedStory.chapters = Array.from({ length: totalChapters }, (_, index) => {
			const chapterNumber = index + 1;
			return updatedStory.chapters[index] || createNewChapter(chapterNumber);
		});

		updatedStory.chapters.forEach(updateChapterStatus);
		return updatedStory;
	});
};

export const updateStep = (newStep: number): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) => ({
			...chapter,
			isActive: chapter.chapterNumber === newStep
		}))
	}));
};

export const setSelectedOption = (
	chapterNumber: number,
	option: string,
	optionKey: keyof Pick<StoryChapter, 'option_1' | 'option_2' | 'option_3'>
): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) =>
			chapter.chapterNumber === chapterNumber
				? updateChapterOption(chapter, optionKey, option, true)
				: chapter
		)
	}));
};

export const addOptionToChapter = (
	chapterNumber: number,
	optionKey: keyof Pick<StoryChapter, 'option_1' | 'option_2' | 'option_3'>,
	newOption: string
): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) =>
			chapter.chapterNumber === chapterNumber
				? updateChapterOption(chapter, optionKey, newOption)
				: chapter
		)
	}));
};

export const updateStoryId = (newStoryId: string): void => {
	updateStoryContent((story) => ({ ...story, storyId: newStoryId }));
};

export const resetStory = (): void => {
	const defaultStory: StoryStatus = {
		storyId: '',
		totalChapters: 0,
		chapters: []
	};
	storyContentStore.set(defaultStory);
	removeFromLocalStorage(LOCAL_STORAGE_KEY);
};

export const triggerPendingContent = (chapterNumber: number): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) =>
			chapter.chapterNumber === chapterNumber && chapter.status === 'not_generated'
				? { ...chapter, status: 'pending_content' }
				: chapter
		)
	}));
};

export const triggerFinalChapterGenerated = (chapterNumber: number): void => {
	updateStoryContent((story) => ({
		...story,
		chapters: story.chapters.map((chapter) =>
			chapter.chapterNumber === chapterNumber
				? { ...chapter, status: 'final_chapter_generated' }
				: chapter
		)
	}));
};
