<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import StoryCard from '$lib/components/StoryCard.svelte';
	import { storyDescriptions } from '$lib/data/storyDescriptions';
	import { page } from '$app/stores';
	import type { StoryDescription } from '$lib/types/story';
	import { onDestroy } from 'svelte';

	let filteredStoryDescriptions: StoryDescription[] = storyDescriptions;
	let searchValue = '';

	let unsubscribe = page.subscribe(($page: { url: URL }) => {
		const tag = $page.url.searchParams.get('tag');
		if (tag) {
			filteredStoryDescriptions = storyDescriptions.filter((description) =>
				description.storyTags.some((storyTag) => storyTag.toLowerCase() === tag.toLowerCase())
			);
		} else {
			filterThemes();
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function filterThemes() {
		filteredStoryDescriptions = storyDescriptions.filter(
			(description) =>
				description.storyTitle.toLowerCase().includes(searchValue) ||
				description.storyTags.some((tag) => tag.toLowerCase().includes(searchValue))
		);
	}

	function handleInput(event: Event) {
		searchValue = (event.target as HTMLInputElement).value.toLowerCase();
		filterThemes();
	}
</script>

<section id="story-themes" class="mb-12">
	<h2 class="mb-6 text-3xl font-bold">Onze Verhalen</h2>
	<div class="mb-4 flex items-center justify-between">
		<p class="text-lg">Kies eerst een basisthema</p>
		<div class="relative">
			<Input type="text" placeholder="Zoek thema's" class="pl-10" on:input={handleInput} />
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={20} />
		</div>
	</div>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredStoryDescriptions as storyDescription (storyDescription.storyId)}
			<StoryCard {storyDescription} />
		{/each}
	</div>
</section>
