<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowDown } from 'lucide-svelte';
	import ResponsiveImage from '$lib/components/ui/responsive-image/ResponsiveImage.svelte';

	let mainText = 'AI Kinderverhalen Generator';
	let subText = '';
	let names = ['Emma', 'Liam', 'Sophia', 'Noah', 'Harry'];
	let currentNameIndex = 0;
	let showingNames = true;
	let isTyping = true;
	let typingSpeed = 150;
	let deletingSpeed = 150;
	let pauseBetweenNames = 1000;

	let interval: ReturnType<typeof setTimeout>;
	let currentNameColor = '';
	let finalTextReached = false;
	let animationComplete = false;

	const nameColors = [
		'bg-red-300',
		'bg-blue-300',
		'bg-green-300',
		'bg-yellow-300',
		'bg-purple-300',
		'bg-pink-300'
	];

	function getRandomColor() {
		return nameColors[Math.floor(Math.random() * nameColors.length)];
	}

	function animateText() {
		if (showingNames) {
			if (subText === '') {
				subText = 'Speciaal voor ';
				interval = setTimeout(animateText, typingSpeed);
			} else if (isTyping) {
				let currentName = names[currentNameIndex];
				let fullText = 'Speciaal voor ' + currentName;
				if (subText.length < fullText.length) {
					if (subText.length === 'Speciaal voor '.length) {
						currentNameColor = getRandomColor();
					}
					subText = fullText.slice(0, subText.length + 1);
					interval = setTimeout(animateText, typingSpeed);
				} else {
					isTyping = false;
					interval = setTimeout(animateText, pauseBetweenNames);
				}
			} else {
				if (subText.length > 'Speciaal voor '.length) {
					subText = subText.slice(0, -1);
					interval = setTimeout(animateText, deletingSpeed);
				} else {
					currentNameIndex = (currentNameIndex + 1) % names.length;
					isTyping = true;
					if (currentNameIndex === 0) {
						showingNames = false;
					}
					interval = setTimeout(animateText, typingSpeed);
				}
			}
		} else {
			if (subText === 'Speciaal voor ') {
				subText += 'j';
				currentNameColor = getRandomColor();
				interval = setTimeout(animateText, typingSpeed);
			} else if (subText.length < 'Speciaal voor jou'.length) {
				subText += 'ou'[subText.length - 'Speciaal voor j'.length];
				interval = setTimeout(animateText, typingSpeed);
			} else if (subText === 'Speciaal voor jou') {
				subText += '!';
				finalTextReached = true;
				animationComplete = true;
			}
		}
	}

	onMount(() => {
		interval = setTimeout(animateText, typingSpeed);
	});

	onDestroy(() => {
		clearTimeout(interval);
	});
</script>

<section
	class="relative mb-12 flex h-[40vh] items-center justify-center overflow-hidden rounded-lg"
>
	<div
		class="absolute inset-0 rounded-lg bg-gradient-to-b from-black/70 to-black/90 backdrop-blur-md transition-opacity duration-500"
		class:opacity-80={subText !== ''}
	></div>
	<ResponsiveImage
		src="/header.webp"
		alt="AI Verhalen Generator"
		className="absolute inset-0 w-full h-full object-cover rounded-lg"
		style="object-position: center 30%;"
	/>
	<div
		class="relative z-10 flex h-full flex-col items-center justify-between px-4 py-8 text-center text-white sm:px-8"
	>
		<div class="flex flex-grow flex-col items-center justify-center">
			<h1
				class="mb-2 text-4xl font-extrabold sm:text-5xl"
				style="text-shadow: 0 3px 6px rgba(0, 0, 0, 0.8);"
			>
				{mainText}
			</h1>
			<h2 class="text-3xl font-bold sm:text-4xl" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);">
				Speciaal voor
				{#if subText.length > 'Speciaal voor '.length}
					<span class="rounded px-1 {currentNameColor}"
						>{subText.slice('Speciaal voor '.length)}</span
					>
				{/if}
				{#if !animationComplete}
					<span class="animate-blink">|</span>
				{/if}
			</h2>
		</div>
		<div class="mt-8">
			<Button
				href="#story-themes"
				variant="default"
				size="lg"
				class="hover:bg-primary-dark flex items-center bg-primary px-8 py-4 text-lg"
				style="animation: gentle-pulse 3s infinite;"
			>
				Kies een basisthema
				<ArrowDown class="ml-2" size={20} />
			</Button>
		</div>
	</div>
</section>

<style>
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	.animate-blink {
		animation: blink 0.7s infinite;
	}
</style>
