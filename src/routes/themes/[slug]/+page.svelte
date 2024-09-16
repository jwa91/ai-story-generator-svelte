<script lang="ts">
	import type { PageData } from './$types';
	import type { StoryDescription } from '$lib/types/story';
	import StoryDetail from '$lib/components/StoryDetail.svelte';
	import StoryForm from '$lib/components/StoryForm.svelte';

	export let data: PageData;
	const storyDescription = data.description as StoryDescription;
	const slug = storyDescription.storyId;
</script>

<div class="container mx-auto max-w-2xl p-4">
	<StoryDetail {storyDescription} />
	<StoryForm {slug} />
</div>
