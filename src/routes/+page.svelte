<script lang="ts">
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import Steps from '$lib/components/Steps.svelte';
	import StoryGrid from '$lib/components/StoryGrid.svelte';

	onMount(() => {
		document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
			anchor.addEventListener('click', (e: Event) => {
				e.preventDefault();
				const href = (anchor as HTMLAnchorElement).getAttribute('href');
				if (href) {
					const target = document.querySelector(href);
					if (target) {
						target.scrollIntoView({
							behavior: 'smooth'
						});
					}
				}
			});
		});
	});
</script>

<svelte:head>
	<style>
		@keyframes gentle-pulse {
			0%,
			100% {
				transform: scale(1);
			}
			50% {
				transform: scale(1.05);
			}
		}
	</style>
</svelte:head>

<div class="container mx-auto px-4">
	<HeroSection />
	<Steps />
	<StoryGrid />
</div>
