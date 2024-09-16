<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import ResponsiveImage from '$lib/components/ui/responsive-image/ResponsiveImage.svelte';
	import type { StoryDescription } from '$lib/types/story';
	import { goto } from '$app/navigation';
	import { updateSettingId } from '$lib/stores/storyStore';

	export let storyDescription: StoryDescription;

	function handleInteraction() {
		updateSettingId(storyDescription.storyId);
		goto(`/themes/${storyDescription.storyId}`);
	}

	function filterByTag(tag: string) {
		goto(`/themes?tag=${encodeURIComponent(tag)}`);
	}
</script>

<div
	role="button"
	tabindex="0"
	on:click={handleInteraction}
	on:keydown={(e) => e.key === 'Enter' && handleInteraction()}
	class="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
	<Card class="overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
		<ResponsiveImage
			src={storyDescription.storyImage}
			alt={storyDescription.storyTitle}
			className="w-full h-48 object-cover"
		/>
		<CardContent class="p-4">
			<h3 class="mb-2 text-xl font-semibold">{storyDescription.storyTitle}</h3>
			<p class="mb-4">{storyDescription.storyDescription}</p>
			<div class="mb-4 flex flex-wrap gap-2">
				{#each storyDescription.storyTags as tag}
					<Badge variant="secondary" on:click={() => filterByTag(tag)}>{tag}</Badge>
				{/each}
			</div>
			<Button variant="default" class="w-full">Kies dit verhaal</Button>
		</CardContent>
	</Card>
</div>
