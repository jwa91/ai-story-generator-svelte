<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const header = document.querySelector('header');
		const headerHeight = header ? header.offsetHeight : 0;

		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (e: Event) => {
				e.preventDefault();

				const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
				if (href) {
					const targetElement = document.querySelector(href);
					if (targetElement) {
						const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
						const offsetPosition = targetPosition - headerHeight - 20; // 20px extra ruimte

						window.scrollTo({
							top: offsetPosition,
							behavior: 'smooth'
						});
					}
				}
			});
		});
	});
</script>

<ModeWatcher />

<div class="min-h-screen bg-background antialiased">
	<Header />
	<main class="container mx-auto p-4 pt-24">
		<slot />
	</main>
	<Footer />
</div>

<style>
	:global(html) {
		scroll-padding-top: calc(var(--header-height, 60px) + 20px);
		scroll-behavior: smooth;
	}
</style>
