<!-- src/lib/components/ui/responsive-image/ResponsiveImage.svelte -->
<script lang="ts">
	export let src: string;
	export let alt: string;
	export let className: string = '';
	export let style: string = '';
</script>

<img {src} {alt} class={className} {style} />
