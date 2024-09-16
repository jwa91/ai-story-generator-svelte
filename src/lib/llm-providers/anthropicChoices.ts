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
		choice1: string;
		choice2: string;
		choice3: string;
	};
}

type ContentBlock = MessageBlock | ToolUseBlock;

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export async function generateStoryChoicesWithAnthropic(prompt: string): Promise<string[]> {
	const response = await anthropic.messages.create({
		model: 'claude-3-5-sonnet-20240620',
		max_tokens: 1024,
		tools: [
			{
				name: 'story_choices',
				description:
					'Genereer exact drie mogelijke vervolgrichtingen voor het verhaal waar de lezer uit kan kiezen. Elke vervolgrichting dient een kort geformuleerde mogelijke vervolgverhaallijn te zijn geschikt voor kinderen, van max 1 regel.',
				input_schema: {
					type: 'object',
					properties: {
						choice1: {
							type: 'string',
							description: 'Eerste mogelijke vervolgrichting van het verhaal'
						},
						choice2: {
							type: 'string',
							description: 'Tweede mogelijke vervolgrichting van het verhaal'
						},
						choice3: {
							type: 'string',
							description: 'Derde mogelijke vervolgrichting van het verhaal'
						}
					},
					required: ['choice1', 'choice2', 'choice3']
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

	// Verwerk de API-respons om de drie vervolgrichtingen te verkrijgen
	let choices: string[] = [
		'Geen keuzes gevonden.',
		'Geen keuzes gevonden.',
		'Geen keuzes gevonden.'
	];

	const contentBlocks = response.content as ContentBlock[];

	const toolUseMessage = contentBlocks.find(
		(item): item is ToolUseBlock => item.type === 'tool_use' && item.name === 'story_choices'
	);

	if (toolUseMessage && typeof toolUseMessage.input === 'object') {
		choices = [
			toolUseMessage.input.choice1,
			toolUseMessage.input.choice2,
			toolUseMessage.input.choice3
		];
	}

	return choices;
}
