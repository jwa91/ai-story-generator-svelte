<script lang="ts">
	import type { StoryDescription } from '$lib/types/story';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { goto } from '$app/navigation';

	export let storyDescription: StoryDescription;

	function filterByTag(tag: string) {
		goto(`/themes?tag=${encodeURIComponent(tag)}`);
	}
</script>

<h1 class="mb-4 text-3xl font-bold">{storyDescription.storyTitle}</h1>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/themes">Themes</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>{storyDescription.storyTitle}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<img
	src={storyDescription.storyImage}
	alt={storyDescription.storyTitle}
	class="mx-auto my-4 w-full max-w-2xl rounded-lg shadow-md"
/>
<p class="mb-4 text-lg">{storyDescription.storyDescription}</p>

<div class="mb-6">
	{#each storyDescription.storyTags as tag}
		<button
			on:click={() => filterByTag(tag)}
			class="mb-2 mr-2 inline-block cursor-pointer rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
		>
			#{tag}
		</button>
	{/each}
</div>
