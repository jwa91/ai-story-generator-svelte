<script>
	import { ArrowRight, Palette, Sparkles, Book } from 'lucide-svelte';
</script>

<section class="w-full bg-background py-8 text-foreground md:py-12 lg:py-16">
	<div class="container px-4 md:px-6">
		<h2 class="mb-4 text-center text-3xl font-bold">Creëer Magische Verhalen met AI</h2>
		<p class="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground">
			AI-technologie maakt het mogelijk om gepersonaliseerde verhalen te creëren die de verbeelding
			van elk kind prikkelen. Kies een thema, voeg details toe, en laat de magie beginnen!
		</p>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="flex flex-col items-center text-center">
				<div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
					<Palette class="h-7 w-7 text-primary-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">Stap 1: Kies een Thema</h3>
				<p class="text-sm text-muted-foreground">
					Selecteer een spannend thema voor het verhaal van je kind.
				</p>
			</div>
			<div class="flex flex-col items-center text-center">
				<div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
					<Sparkles class="h-7 w-7 text-primary-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">Stap 2: Voeg Details Toe</h3>
				<p class="text-sm text-muted-foreground">
					Personaliseer het verhaal met unieke details en karakters.
				</p>
			</div>
			<div class="flex flex-col items-center text-center">
				<div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
					<Book class="h-7 w-7 text-primary-foreground" />
				</div>
				<h3 class="mb-2 text-lg font-semibold">Stap 3: Laat de Magie Beginnen</h3>
				<p class="text-sm text-muted-foreground">
					Onze AI creëert een uniek verhaal dat de verbeelding prikkelt.
				</p>
			</div>
		</div>
		<div class="mt-8 flex justify-center">
			<a
				href="#story-themes"
				class="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-primary
					 px-4 py-2 text-sm
					 font-medium text-primary-foreground
					 ring-offset-background transition-colors hover:bg-primary/90
					 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
					 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
			>
				Begin met Jouw Verhaal
				<ArrowRight class="ml-2 h-4 w-4" />
			</a>
		</div>
	</div>
</section>
