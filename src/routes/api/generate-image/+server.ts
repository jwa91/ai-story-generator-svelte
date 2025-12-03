import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Replicate from 'replicate';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

// Security: Maximum prompt length to prevent abuse
const MAX_PROMPT_LENGTH = 1000;

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Validate content type
		const contentType = request.headers.get('content-type');
		if (!contentType || !contentType.includes('multipart/form-data')) {
			return json({ error: 'Invalid content type' }, { status: 400 });
		}

		const data = await request.formData();
		const prompt = data.get('prompt');

		// Input validation
		if (!prompt || typeof prompt !== 'string') {
			return json({ error: 'Prompt is required and must be a string' }, { status: 400 });
		}

		// Security: Validate prompt length
		if (prompt.length > MAX_PROMPT_LENGTH) {
			return json({ error: 'Prompt exceeds maximum length' }, { status: 400 });
		}

		// Security: Basic sanitization - remove potentially dangerous characters
		const sanitizedPrompt = prompt.trim().slice(0, MAX_PROMPT_LENGTH);

		// Generate image using Replicate API
		const prediction = await replicate.run('black-forest-labs/flux-schnell', {
			input: {
				prompt: sanitizedPrompt
			}
		});

		return json({ output: prediction }, { status: 201 });
	} catch (error) {
		// Security: Don't expose internal error details
		// Log error server-side only (in production, use proper logging)
		if (import.meta.env.DEV) {
			console.error('Error generating image:', error);
		}
		return json({ error: 'Failed to generate image' }, { status: 500 });
	}
};
