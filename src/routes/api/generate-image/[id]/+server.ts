import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Replicate from 'replicate';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

// Security: Validate ID format (UUID or alphanumeric)
const ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_ID_LENGTH = 100;

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		// Input validation
		if (!id || typeof id !== 'string') {
			return json({ error: 'Invalid prediction ID' }, { status: 400 });
		}

		// Security: Validate ID length and format
		if (id.length > MAX_ID_LENGTH || !ID_PATTERN.test(id)) {
			return json({ error: 'Invalid prediction ID format' }, { status: 400 });
		}

		const prediction = await replicate.predictions.get(id);

		if (prediction?.error) {
			// Security: Don't expose detailed error information
			if (import.meta.env.DEV) {
				console.error('Prediction error:', prediction.error);
			}
			return json({ error: 'Prediction failed' }, { status: 500 });
		}

		return json(prediction, { status: 200 });
	} catch (error) {
		// Security: Don't expose internal error details
		// Log error server-side only (in production, use proper logging)
		if (import.meta.env.DEV) {
			console.error('Error fetching prediction:', error);
		}
		return json({ error: 'Failed to fetch prediction' }, { status: 500 });
	}
};
