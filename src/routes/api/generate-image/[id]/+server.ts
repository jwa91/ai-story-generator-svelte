import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Replicate from 'replicate';
import { REPLICATE_API_TOKEN } from '$env/static/private';

const replicate = new Replicate({
	auth: REPLICATE_API_TOKEN
});

export const GET: RequestHandler = async ({ params }) => {
	try {
		const prediction = await replicate.predictions.get(params.id);

		if (prediction?.error) {
			console.error('Prediction error:', prediction.error);
			return json({ error: prediction.error.detail }, { status: 500 });
		}

		return json(prediction, { status: 200 });
	} catch (error) {
		console.error('Error fetching prediction:', error);
		if (error instanceof Error) {
			return json({ error: 'Failed to fetch prediction', details: error.message }, { status: 500 });
		}
		return json({ error: 'An unknown error occurred' }, { status: 500 });
	}
};
