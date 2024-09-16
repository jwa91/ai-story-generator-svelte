<script>
	import { Pen, BookOpen, Bot } from 'lucide-svelte';

	let loading = true;
</script>

<div class="flex h-full items-center justify-center">
	{#if loading}
		<div class="flex space-x-8">
			<div class="animate-fade-in-out text-muted-foreground">
				<Bot size={28} />
			</div>
			<div class="animate-fade-in-out text-muted-foreground delay-1000">
				<Pen size={28} />
			</div>
			<div class="animate-fade-in-out delay-2000 text-muted-foreground">
				<BookOpen size={28} />
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in-out {
		0%,
		100% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}

	.animate-fade-in-out {
		animation: fade-in-out 3s ease-in-out infinite;
	}

	.delay-1000 {
		animation-delay: 1s;
	}

	.delay-2000 {
		animation-delay: 2s;
	}
</style>
