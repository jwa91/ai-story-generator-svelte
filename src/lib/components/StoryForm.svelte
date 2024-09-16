<script lang="ts">
	import { storyStore, updateChildData } from '$lib/stores/storyStore';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Slider } from '$lib/components/ui/slider';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { ChildData } from '$lib/types/story';
	import { v4 as uuidv4 } from 'uuid';
	import { updateStory, updateStoryId, resetStory } from '$lib/stores/storyStatus';

	export let slug: string;

	let childData: ChildData;
	let formValid = false;

	const unsubscribe = storyStore.subscribeChildData((value) => {
		childData = value;
		validateForm();
	});

	onMount(() => {
		return unsubscribe;
	});

	function validateForm() {
		formValid =
			!!childData.childName &&
			!!childData.childAge &&
			childData.childAge >= 3 &&
			childData.childAge <= 12 &&
			!!childData.childInterests &&
			childData.childChapters >= 3 &&
			childData.childChapters <= 6 &&
			childData.childTensionLevel >= 1 &&
			childData.childTensionLevel <= 10 &&
			childData.childAgreement;
	}

	function handleSubmit() {
		if (!formValid) {
			alert('Vul alsjeblieft alle verplichte velden in en ga akkoord met de voorwaarden.');
			return;
		}
		resetStory();
		const newStoryId = uuidv4();
		updateStoryId(newStoryId);
		updateStory({
			storyId: newStoryId,
			totalChapters: childData.childChapters,
			chapters: []
		});
		goto(`/themes/${slug}/reader`);
	}

	function handleInputChange(event: Event, field: keyof ChildData) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		updateChildData({ [field]: target.value });
		validateForm();
	}

	function handleCheckboxChange(checked: boolean | 'indeterminate') {
		if (typeof checked === 'boolean') {
			updateChildData({ childAgreement: checked });
			validateForm();
		}
	}
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle>Genereer jouw verhaal</CardTitle>
		<CardDescription>
			Vul het formulier in om een gepersonaliseerd verhaal te maken. Alle velden zijn verplicht.
		</CardDescription>
	</CardHeader>
	<CardContent>
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="name">Naam</Label>
					<Input
						type="text"
						id="name"
						value={childData.childName}
						on:input={(e) => handleInputChange(e, 'childName')}
						class="w-full"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="age">Leeftijd</Label>
					<Input
						type="number"
						id="age"
						value={childData.childAge}
						on:input={(e) => handleInputChange(e, 'childAge')}
						class="w-full"
						min="3"
						max="12"
						required
					/>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="interests">Interesses</Label>
				<Textarea
					id="interests"
					value={childData.childInterests}
					on:input={(e) => handleInputChange(e, 'childInterests')}
					class="w-full"
					placeholder="Bijv. voetballen bij (clubnaam), tekenen met (naam vriend), wandelen met onze hond (naam) ..."
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="chapters">Aantal hoofdstukken</Label>
				<div class="px-4">
					<Slider
						id="chapters"
						min={3}
						max={6}
						step={1}
						value={[childData.childChapters]}
						onValueChange={(value) => {
							updateChildData({ childChapters: value[0] });
							validateForm();
						}}
					/>
				</div>
				<p class="text-muted-foreground">Geselecteerd: {childData.childChapters} hoofdstukken</p>
			</div>

			<div class="space-y-2">
				<Label for="tension">Spanningsniveau</Label>
				<div class="px-4">
					<Slider
						id="tension"
						min={1}
						max={10}
						step={1}
						value={[childData.childTensionLevel]}
						onValueChange={(value) => {
							updateChildData({ childTensionLevel: value[0] });
							validateForm();
						}}
					/>
				</div>
				<p class="text-muted-foreground">Geselecteerd: {childData.childTensionLevel}</p>
			</div>

			<div class="flex items-center space-x-2">
				<Checkbox
					id="agreement"
					checked={childData.childAgreement}
					onCheckedChange={handleCheckboxChange}
					required
				/>
				<Label for="agreement"
					>Ik snap dat het verhaal door AI wordt gegenereerd en dat er onverwachte resultaten kunnen
					ontstaan</Label
				>
			</div>

			<Button type="submit" class="w-full" disabled={!formValid}>Genereer verhaal</Button>
		</form>
	</CardContent>
</Card>
