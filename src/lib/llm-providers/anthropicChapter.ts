import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

interface MessageBlock {
	type: 'message';
	role: string;
	content: string;
}

interface ToolUseBlock {
	type: 'tool_use';
	name: string;
	input: {
		content: string;
	};
}

type ContentBlock = MessageBlock | ToolUseBlock;

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function generateChapterWithAnthropic(prompt: string): Promise<string> {
	const response = await anthropic.messages.create({
		model: 'claude-3-5-sonnet-20240620',
		max_tokens: 1024,
		tools: [
			{
				name: 'structured_chapter',
				description: 'Genereer een gestructureerd hoofdstuk met alleen de inhoud',
				input_schema: {
					type: 'object',
					properties: {
						content: {
							type: 'string',
							description:
								'De inhoud van het hoofdstuk (geef geen titel, enkel de content van het hoofdstuk zelf)'
						}
					},
					required: ['content']
				}
			}
		],
		messages: [
			{
				role: 'user',
				content: prompt
			}
		]
	});

	// Verwerk de API-respons om alleen de hoofdstukinhoud te verkrijgen
	let content = 'Geen inhoud gevonden.';

	const contentBlocks = response.content as ContentBlock[];

	const toolUseMessage = contentBlocks.find(
		(item): item is ToolUseBlock => item.type === 'tool_use' && item.name === 'structured_chapter'
	);

	if (toolUseMessage && typeof toolUseMessage.input === 'object') {
		content = toolUseMessage.input.content;
	}

	return content;
}
