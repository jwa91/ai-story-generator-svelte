import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

interface MessageBlock {
	type: 'message';
	role: 'user' | 'assistant';
	content: string;
}

interface ToolUseBlock {
	type: 'tool_use';
	name: string;
	input: {
		prompt: string;
	};
}

type ContentBlock = MessageBlock | ToolUseBlock;

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function generateImagePromptWithAnthropic(chapter: string): Promise<string> {
	const response = await anthropic.messages.create({
		model: 'claude-3-sonnet-20240229',
		max_tokens: 1024,
		tools: [
			{
				name: 'generate_image_prompt',
				description:
					'Generate a concise description of a scene from the chapter, suitable as a prompt for an image generation model. Focus on the setting and actions without detailed descriptions of characters.',
				input_schema: {
					type: 'object',
					properties: {
						prompt: {
							type: 'string',
							description: 'Concise scene description for image generation'
						}
					},
					required: ['prompt']
				}
			}
		],
		messages: [
			{
				role: 'user',
				content: `Summarize a key scene from the chapter in 1 sentence. Focus on clear descriptions of the setting and actions. Do not describe character appearances or add any atmosphere. Provide the output in English, even if the input is in Dutch.\n\n${chapter}`
			}
		]
	});

	// Process the API response to obtain the prompt
	let prompt: string = 'No prompt found.';

	const contentBlocks = response.content as ContentBlock[];

	const toolUseMessage = contentBlocks.find(
		(item): item is ToolUseBlock =>
			item.type === 'tool_use' && item.name === 'generate_image_prompt'
	);

	if (toolUseMessage && typeof toolUseMessage.input === 'object') {
		prompt = toolUseMessage.input.prompt;
	}

	return prompt;
}
