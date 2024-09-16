import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { storyDescriptions } from '$lib/data/storyDescriptions';

export const load: PageServerLoad = async ({ params }) => {
	const description = storyDescriptions.find((d) => d.storyId === params.slug);

	if (!description) {
		throw error(404, 'Thema niet gevonden');
	}

	return {
		description
	};
};
