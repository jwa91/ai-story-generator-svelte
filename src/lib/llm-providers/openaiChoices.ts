import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

// Definieer het schema met drie losse velden voor de keuzes
const StoryChoicesSchema = z.object({
	option1: z.string().describe('De eerste mogelijke vervolgrichting voor het verhaal.'),
	option2: z.string().describe('De tweede mogelijke vervolgrichting voor het verhaal.'),
	option3: z.string().describe('De derde mogelijke vervolgrichting voor het verhaal.')
});

export async function generateStoryChoicesWithOpenAI(prompt: string): Promise<string[]> {
	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-2024-08-06',
		messages: [
			{
				role: 'system',
				content:
					'genereer drie mogelijke vervolgrichtingen voor een kinderverhaal.elke vervolgrichting dient een simpele string te zijn van max 1 korte zin.'
			},
			{ role: 'user', content: prompt }
		],
		response_format: zodResponseFormat(StoryChoicesSchema, 'storyChoices')
	});

	const storyChoices = completion.choices[0].message;

	if (storyChoices.parsed) {
		// Retourneer de drie opties als een array
		return [storyChoices.parsed.option1, storyChoices.parsed.option2, storyChoices.parsed.option3];
	} else if (storyChoices.refusal) {
		throw new Error('AI weigerde vervolgrichtingen te genereren: ' + storyChoices.refusal);
	} else {
		throw new Error('Onverwacht response-formaat');
	}
}
