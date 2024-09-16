import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

// Define the schema that only contains the prompt
const ImagePromptSchema = z.object({
	prompt: z
		.string()
		.describe(
			'A concise description of a scene from the chapter, suitable as a prompt for an image generator.'
		)
});

export async function generateImagePromptWithOpenAI(chapter: string): Promise<string> {
	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content:
					'Summarize a key scene from the chapter in 1 sentence. Focus on clear descriptions of the setting and actions. Do not describe character appearances or add any atmosphere. Provide the output in English, even if the input is in Dutch.'
			},
			{ role: 'user', content: chapter }
		],
		response_format: zodResponseFormat(ImagePromptSchema, 'imagePrompt')
	});

	const imagePrompt = completion.choices[0].message;

	if (imagePrompt.parsed) {
		// Return the generated prompt
		return imagePrompt.parsed.prompt;
	} else if (imagePrompt.refusal) {
		throw new Error('AI refused to generate a prompt: ' + imagePrompt.refusal);
	} else {
		throw new Error('Unexpected response format');
	}
}
