import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { generateImagePromptWithAnthropic } from '$lib/llm-providers/anthropicImagePrompt';
import { generateImagePromptWithOpenAI } from '$lib/llm-providers/openaiImagePrompt';
import { storyImageStyling } from '$lib/data/storyImageStyling';

// Helper function to get story image styling based on settingId
function getStoryImageStyling(settingId: string): string | null {
	const storyStyle = storyImageStyling.find((story) => story.storyId === settingId);
	console.log('Found story style:', storyStyle); // Add logging to debug
	return storyStyle ? storyStyle.storyImageStyling : null; // Return the correct field
}

// Helper function to generate the final image prompt
function buildImagePrompt(basePrompt: string, imageStyling: string | null): string {
	if (imageStyling) {
		return `${basePrompt} in a style of: ${imageStyling}`;
	}
	return basePrompt;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const {
			chapter,
			settingId,
			provider
		}: { chapter: string; settingId: string; provider?: string } = await request.json();

		if (!chapter || !settingId) {
			return json({ error: 'Chapter and settingId are required' }, { status: 400 });
		}

		let imagePrompt: string;

		// Generate the base image prompt
		switch (provider) {
			case 'anthropic':
				imagePrompt = await generateImagePromptWithAnthropic(chapter);
				break;
			case 'openai':
				imagePrompt = await generateImagePromptWithOpenAI(chapter);
				break;
			default:
				imagePrompt = await generateImagePromptWithOpenAI(chapter);
				break;
		}

		// Get the story image styling
		const storyStyling = getStoryImageStyling(settingId);

		// Build the final image prompt with the styling
		const finalPrompt = buildImagePrompt(imagePrompt, storyStyling);
		console.log('Generated Image Prompt with Styling:', finalPrompt);

		return json({ imagePrompt: finalPrompt }, { status: 200 });
	} catch (error) {
		console.error('Error generating image prompt:', error);
		return json({ error: 'Cannot generate image prompt' }, { status: 500 });
	}
};
