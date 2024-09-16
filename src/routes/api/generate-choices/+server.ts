import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { generateStoryChoicesWithAnthropic } from '$lib/llm-providers/anthropicChoices';
import { generateStoryChoicesWithOpenAI } from '$lib/llm-providers/openaiChoices';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { prompt, provider }: { prompt: string; provider?: string } = await request.json();

		if (!prompt) {
			return json({ error: 'Prompt is vereist' }, { status: 400 });
		}

		let choices: string[];

		switch (provider) {
			case 'anthropic':
				choices = await generateStoryChoicesWithAnthropic(prompt);
				break;
			case 'openai':
				choices = await generateStoryChoicesWithOpenAI(prompt);
				break;
			default:
				choices = await generateStoryChoicesWithAnthropic(prompt);
				break;
		}

		// Placeholder voor een toekomstige API-aanroep met de output
		console.log('Output:', choices);

		return json({ choices }, { status: 200 });
	} catch (error) {
		console.error('Fout bij het genereren van de verhaalkeuzes:', error);
		return json({ error: 'Kan de verhaalkeuzes niet genereren' }, { status: 500 });
	}
};
