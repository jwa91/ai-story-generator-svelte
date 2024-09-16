import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

const ChapterSchema = z.object({
	content: z
		.string()
		.describe('De inhoud van het hoofdstuk; geef geen titel, alleen de inhoud zelf')
});

export async function generateChapterWithOpenAI(prompt: string): Promise<string> {
	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-2024-08-06',
		messages: [
			{ role: 'system', content: 'Je bent een AI die gestructureerde boekhoofdstukken genereert.' },
			{ role: 'user', content: prompt }
		],
		response_format: zodResponseFormat(ChapterSchema, 'chapter')
	});

	const chapter = completion.choices[0].message;

	if (chapter.parsed) {
		return chapter.parsed.content;
	} else if (chapter.refusal) {
		throw new Error('AI weigerde inhoud te genereren: ' + chapter.refusal);
	} else {
		throw new Error('Onverwacht response-formaat');
	}
}
