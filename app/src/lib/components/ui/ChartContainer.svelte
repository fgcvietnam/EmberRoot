<!-- ────────────────────────────────────────────────────────────────
  ChartContainer.svelte — EmberRoot Design System
  A standardised wrapper for any chart library.
  Accepts a toolbar snippet and optional fixed aspect ratio.
──────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		aspectRatio?: 'video' | 'square' | 'tall' | 'auto';
		minHeight?: string;
		class?: string;
		children?: Snippet;
		toolbar?: Snippet;
	}

	let {
		title,
		subtitle,
		aspectRatio = 'auto',
		minHeight = '200px',
		class: className = '',
		children,
		toolbar
	}: Props = $props();

	const ratios: Record<string, string> = {
		video:  '56.25%',
		square: '100%',
		tall:   '75%',
		auto:   '',
	};
</script>

<Card padding="md" class="flex flex-col {className}">
	<div class="flex items-start justify-between mb-4 gap-3">
		<div class="flex flex-col gap-[2px]">
			<h3 class="text-xs font-semibold tracking-[0.07em] uppercase text-text-primary m-0">{title}</h3>
			{#if subtitle}
				<p class="text-[11px] text-text-muted">{subtitle}</p>
			{/if}
		</div>
		{#if toolbar}
			<div class="flex items-center gap-[6px] shrink-0">{@render toolbar()}</div>
		{/if}
	</div>

	{#if aspectRatio !== 'auto'}
		<div class="relative w-full" style="padding-top: {ratios[aspectRatio]}">
			<div class="absolute inset-0 flex">
				{@render children?.()}
			</div>
		</div>
	{:else}
		<div class="flex-1 relative flex" style="min-height: {minHeight}">
			{@render children?.()}
		</div>
	{/if}
</Card>
