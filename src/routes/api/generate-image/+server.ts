import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Replicate from 'replicate';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.formData();
		const prompt = data.get('prompt');

		// Log prompt for debugging
		console.log('Received prompt:', prompt);

		if (!prompt) {
			return json({ error: 'Prompt not provided' }, { status: 400 });
		}

		// Generate image using Replicate API
		const prediction = await replicate.run('black-forest-labs/flux-schnell', {
			input: {
				prompt: prompt.toString()
			}
		});

		return json({ output: prediction }, { status: 201 });
	} catch (error) {
		console.error('Error generating image:', error);
		if (error instanceof Error) {
			return json({ error: 'Failed to generate image', details: error.message }, { status: 500 });
		}
		return json({ error: 'An unknown error occurred' }, { status: 500 });
	}
};
