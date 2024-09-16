import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ChildData, StoryPromptSnippet, StoryStatus } from '$lib/types/story';
import { storyPromptSnippets } from '$lib/data/storyPromptSnippets';
import { generateTensionLevelPrompt, generateAgePrompt } from '$lib/utils/promptutils';

interface AIStoryCallData {
	settingId: string;
	childData: ChildData;
	storyStatus: StoryStatus;
}

// Helper functies voor promptgeneratie
const generateChildDataPrompt = (childData: ChildData): string => {
	const { childName, childAge, childInterests, childTensionLevel } = childData;
	const agePrompt = generateAgePrompt(childAge);
	const tensionLevelPrompt = generateTensionLevelPrompt(childTensionLevel);

	return `
            Schrijf een uniek kinderverhaal voor ${childName}, een ${childAge}-jarige met interesse in ${childInterests}.

            ${agePrompt}
            ${tensionLevelPrompt}
        `;
};

const generateStoryStatusPrompt = (storyStatus: StoryStatus): string => {
	const activeChapter = storyStatus.chapters.find((chapter) => chapter.isActive)!;
	let prompt = `
            Het verhaal bevat in totaal ${storyStatus.totalChapters} hoofdstukken. Het huidige hoofdstuk is nummer ${activeChapter.chapterNumber}. Schrijf het hoofdstuk, maak het 4 alineas lang.
        `;

	if (activeChapter.chapterNumber > 1) {
		const previousChapters = storyStatus.chapters
			.filter((chapter) => chapter.chapterNumber < activeChapter.chapterNumber)
			.sort((a, b) => a.chapterNumber - b.chapterNumber);

		const previousContent = previousChapters.map((chapter) => chapter.content).join('\n\n');

		// Verwerken van de opties uit het vorige hoofdstuk
		const previousChapter = previousChapters[previousChapters.length - 1];
		const { option_1, option_2, option_3 } = previousChapter;
		const selectedOption = [option_1, option_2, option_3].find((option) => option.isSelected);

		prompt += `
            Schrijf een logisch vervolg op het tot nu toe gegenereerde verhaal en de door de lezer gekozen vervolgrichting voor dit verhaal:
            ${previousContent}


            De lezer koos voor: ${selectedOption ? selectedOption.option : 'geen geselecteerde optie'}, zorg ervoor dat het vervolg in lijn is met deze keuze.
        `;
	}

	// Als het huidige hoofdstuk het laatste hoofdstuk is
	if (activeChapter.chapterNumber === storyStatus.totalChapters) {
		prompt += `
            Schrijf een bevredigend einde van dit verhaal.
        `;
	}

	return prompt;
};

const handleStorySetting = (storySnippet: StoryPromptSnippet): string => {
	return `De setting is ${storySnippet.storySetting}.`;
};

const handleStoryCharacter = (storySnippet: StoryPromptSnippet, childName: string): string => {
	return `De hoofdpersoon is ${storySnippet.storyCharacter} genaamd ${childName}.`;
};

const handleStoryIntroEnd = (storySnippet: StoryPromptSnippet): string => {
	return `Schrijf een sfeervolle introductie waarin de hoofdpersoon en setting worden geïntroduceerd. Sluit af met ${storySnippet.storyIntroEnd}.`;
};

const handleStoryStyle = (storySnippet: StoryPromptSnippet): string => {
	return `Schrijf het verhaal in de stijl van ${storySnippet.storyStyle}.`;
};

const generateStoryPromptSnippet = (
	storySnippet: StoryPromptSnippet,
	childName: string,
	chapterNumber: number
): string => {
	return `
			${chapterNumber === 1 ? handleStorySetting(storySnippet) : ''}
            ${handleStoryCharacter(storySnippet, childName)}
            ${chapterNumber === 1 ? handleStoryIntroEnd(storySnippet) : ''}
            ${handleStoryStyle(storySnippet)}
        `;
};

const handleChildData = (childData: ChildData): string => {
	console.log('Processing Child Data');
	return generateChildDataPrompt(childData);
};

const handleStoryStatus = (storyStatus: StoryStatus): string => {
	const activeChapter = storyStatus.chapters.find((chapter) => chapter.isActive);
	if (!activeChapter) {
		console.error('Er is geen actief hoofdstuk in de StoryStatus.');
		throw new Error('Geen actief hoofdstuk in de StoryStatus.');
	}
	console.log('Processing Story Status');
	return generateStoryStatusPrompt(storyStatus);
};

const handleStoryPromptSnippets = (
	settingId: string,
	childName: string,
	chapterNumber: number
): string => {
	const storySnippet = storyPromptSnippets.find((snippet) => snippet.storyId === settingId);
	if (!storySnippet) {
		console.log(`No matching StoryPromptSnippet found for settingId: ${settingId}`);
		return 'Geen bijpassende verhaal snippet gevonden.';
	}
	console.log('Found matching StoryPromptSnippet');
	return generateStoryPromptSnippet(storySnippet, childName, chapterNumber);
};

// API handler
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data: AIStoryCallData = await request.json();

		// Log de ontvangen data
		console.log('Received data in AI Story Calls API:');
		console.log('Setting ID:', data.settingId);
		console.log('Child Data:', JSON.stringify(data.childData, null, 2));
		console.log('Story Status:', JSON.stringify(data.storyStatus, null, 2));

		// Haal actieve hoofdstuk op
		const activeChapter = data.storyStatus.chapters.find((chapter) => chapter.isActive);
		if (!activeChapter) {
			throw new Error('Geen actief hoofdstuk in de StoryStatus.');
		}
		const activeChapterNumber = activeChapter.chapterNumber;

		// Genereer prompt
		const childDataPrompt = handleChildData(data.childData);
		const storyStatusPrompt = handleStoryStatus(data.storyStatus);
		const storyPromptSnippet = handleStoryPromptSnippets(
			data.settingId,
			data.childData.childName,
			activeChapterNumber
		);
		const finalPrompt = `
            ${childDataPrompt}
            ${storyStatusPrompt}
            ${storyPromptSnippet}
        `;

		console.log('Generated Prompt:', finalPrompt);

		return json({
			success: true,
			message: 'Prompt successfully generated',
			prompt: finalPrompt
		});
	} catch (error) {
		console.error('Error in AI Story Calls API:', error);
		return json({ success: false, message: 'Error processing the request' }, { status: 500 });
	}
};
