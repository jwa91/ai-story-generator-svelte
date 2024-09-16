import type { ChildData, StoryStatus } from '$lib/types/story';

export async function generatePrompt(
	settingId: string,
	childData: ChildData,
	story: StoryStatus | undefined
) {
	const promptResponse = await fetch('/api/generate-prompt', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			settingId,
			childData,
			storyStatus: story
		})
	});

	if (!promptResponse.ok) {
		throw new Error('Failed to generate prompt');
	}

	return await promptResponse.json();
}

export async function generateChapter(prompt: string) {
	const chapterResponse = await fetch('/api/generate-chapter', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt
		})
	});

	if (!chapterResponse.ok) {
		throw new Error('Failed to generate chapter');
	}

	return await chapterResponse.json();
}

export async function generateChoices(prompt: string) {
	const choicesResponse = await fetch('/api/generate-choices', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt
		})
	});

	if (!choicesResponse.ok) {
		throw new Error('Failed to generate choices');
	}

	return await choicesResponse.json();
}

export async function generateImagePrompt(chapter: string, settingId: string) {
	const imagePromptResponse = await fetch('/api/generate-image-prompt', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chapter,
			settingId
		})
	});

	if (!imagePromptResponse.ok) {
		throw new Error('Failed to generate image prompt');
	}

	return await imagePromptResponse.json();
}

export async function generateImage(prompt: string) {
	try {
		const formData = new FormData();
		formData.append('prompt', prompt);

		const response = await fetch('/api/generate-image', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to generate image');
		}

		const data = await response.json();

		if (data.error) {
			throw new Error(data.error);
		}

		if (Array.isArray(data.output) && data.output.length > 0) {
			return data.output[0];
		} else {
			throw new Error('No image was generated');
		}
	} catch (error) {
		console.error('Error generating image:', error);
		throw error;
	}
}
