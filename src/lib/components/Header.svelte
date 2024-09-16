<script lang="ts">
	import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Menu, Settings, Github, Info, Home, ExternalLink } from 'lucide-svelte';
	import ModeToggle from './ModeToggle.svelte';

	let isOpen = false;

	const menuItems = [
		{ href: '/', label: 'Home', icon: Home },
		{
			href: 'https://github.com/jwa91/ai-story-generator-svelte',
			label: 'GitHub',
			icon: Github,
			external: true
		},
		{ href: 'https://janwillemaltink.eu/blog', label: 'Over', icon: Info, external: true }
	];
</script>

<header class="fixed left-0 right-0 top-0 z-50 bg-background/80 shadow-md backdrop-blur-sm">
	<nav class="container mx-auto p-4">
		<div class="flex items-center justify-between">
			<a href="/" class="text-2xl font-bold">AI Story Generator</a>

			<!-- Desktop menu -->
			<ul class="hidden items-center space-x-6 md:flex">
				{#each menuItems as item}
					<li>
						<a
							href={item.href}
							class="flex items-center hover:underline"
							target={item.external ? '_blank' : '_self'}
							rel={item.external ? 'noopener noreferrer' : ''}
						>
							<svelte:component this={item.icon} class="mr-2 h-4 w-4" />
							{item.label}
							{#if item.external}
								<ExternalLink class="ml-1 h-3 w-3" />
							{/if}
						</a>
					</li>
				{/each}
				<li>
					<Button href="/instellingen" variant="outline" size="icon">
						<Settings class="h-4 w-4" />
						<span class="sr-only">Instellingen</span>
					</Button>
				</li>
				<li><ModeToggle /></li>
			</ul>

			<!-- Mobile menu -->
			<div class="flex items-center space-x-2 md:hidden">
				<Button href="/instellingen" variant="outline" size="icon">
					<Settings class="h-4 w-4" />
					<span class="sr-only">Instellingen</span>
				</Button>
				<ModeToggle />
				<Sheet bind:open={isOpen}>
					<SheetTrigger>
						<Menu class="h-6 w-6" />
					</SheetTrigger>
					<SheetContent>
						<nav class="flex flex-col space-y-4">
							{#each menuItems as item}
								<a
									href={item.href}
									class="flex items-center hover:underline"
									target={item.external ? '_blank' : '_self'}
									rel={item.external ? 'noopener noreferrer' : ''}
									on:click={() => (isOpen = false)}
								>
									<svelte:component this={item.icon} class="mr-2 h-4 w-4" />
									{item.label}
									{#if item.external}
										<ExternalLink class="ml-1 h-3 w-3" />
									{/if}
								</a>
							{/each}
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</nav>
</header>
