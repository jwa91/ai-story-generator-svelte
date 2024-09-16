// src/routes/api/generate-chapter/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { generateChapterWithAnthropic } from '$lib/llm-providers/anthropicChapter';
import { generateChapterWithOpenAI } from '$lib/llm-providers/openaiChapter';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { prompt, provider }: { prompt: string; provider?: string } = await request.json();

		if (!prompt) {
			return json({ error: 'Prompt is vereist' }, { status: 400 });
		}

		let content: string;

		switch (provider) {
			case 'anthropic':
				content = await generateChapterWithAnthropic(prompt);
				break;
			case 'openai':
				content = await generateChapterWithOpenAI(prompt);
				break;
			default:
				content = await generateChapterWithAnthropic(prompt);
				break;
		}

		console.log('Output:', content);

		return json({ content }, { status: 200 });
	} catch (error) {
		console.error('Fout bij het genereren van het hoofdstuk:', error);
		return json({ error: 'Kan het verhaal niet genereren' }, { status: 500 });
	}
};
