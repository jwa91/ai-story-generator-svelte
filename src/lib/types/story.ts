export type ChapterStatus =
	| 'generated'
	| 'pending_content'
	| 'pending_choices'
	| 'not_generated'
	| 'final_chapter_generated';

export interface ChapterOption {
	option: string;
	isSelected: boolean;
}

export interface StoryChapter {
	chapterNumber: number;
	content: string;
	option_1: ChapterOption;
	option_2: ChapterOption;
	option_3: ChapterOption;
	isActive: boolean;
	status: ChapterStatus;
	image: string;
}

export interface StoryStatus {
	storyId: string;
	totalChapters: number;
	chapters: StoryChapter[];
}

export type StoryTag = string;

export interface StoryDescription {
	storyId: string;
	storyTitle: string;
	storyImage: string;
	storyDescription: string;
	storyTags: string[];
}

export interface StoryPromptSnippet {
	storyId: string;
	storyStyle: string;
	storyCharacter: string;
	storyIntroEnd: string;
	storySetting: string;
}

export type SettingChoice = {
	settingId: string;
};

export interface ChildData {
	childName: string;
	childAge: number;
	childInterests: string;
	childChapters: number;
	childTensionLevel: number;
	childAgreement: boolean;
}

export interface TextBlock {
	type: 'text';
	text: string;
}

export interface ToolUseInput {
	content: string;
	option_1: string;
	option_2: string;
	option_3: string;
}

export interface ToolUseBlock {
	type: 'tool_use';
	id: string;
	name: string;
	input: ToolUseInput;
}

export type ContentBlock = TextBlock | ToolUseBlock;

export interface StoryImageStyling {
	storyId: string;
	storyImageStyling: string;
}
