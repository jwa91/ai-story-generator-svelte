// src/routes/api/generate-chapter/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { generateChapterWithAnthropic } from '$lib/llm-providers/anthropicChapter';
import { generateChapterWithOpenAI } from '$lib/llm-providers/openaiChapter';

// Security: Maximum prompt length to prevent abuse
const MAX_PROMPT_LENGTH = 10000;
const ALLOWED_PROVIDERS = ['anthropic', 'openai'];

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Validate content type
		const contentType = request.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			return json({ error: 'Invalid content type' }, { status: 400 });
		}

		const body = await request.json();
		const { prompt, provider }: { prompt: unknown; provider?: unknown } = body;

		// Input validation
		if (!prompt || typeof prompt !== 'string') {
			return json({ error: 'Prompt is required and must be a string' }, { status: 400 });
		}

		// Security: Validate prompt length
		if (prompt.length > MAX_PROMPT_LENGTH) {
			return json({ error: 'Prompt exceeds maximum length' }, { status: 400 });
		}

		// Security: Validate provider
		const validProvider = provider && typeof provider === 'string' && ALLOWED_PROVIDERS.includes(provider)
			? provider
			: 'anthropic';

		let content: string;

		switch (validProvider) {
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

		return json({ content }, { status: 200 });
	} catch (error) {
		// Security: Don't expose internal error details
		// Log error server-side only (in production, use proper logging)
		if (import.meta.env.DEV) {
			console.error('Error generating chapter:', error);
		}
		return json({ error: 'Failed to generate chapter' }, { status: 500 });
	}
};
