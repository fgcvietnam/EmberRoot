<!-- ──────────────────────────────────────────────────────────────────────────
  ChartTooltip.svelte — Shared floating HTML tooltip for all chart types.
  Parent container must have position:relative.
────────────────────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import type { TooltipItem } from './types.js';

	interface Props {
		visible: boolean;
		x: number;
		y: number;
		title?: string;
		items: TooltipItem[];
		align?: 'left' | 'right';
	}

	let { visible, x, y, title, items, align = 'left' }: Props = $props();
</script>

{#if visible && items.length > 0}
	<div
		class="absolute z-[300] pointer-events-none bg-[#0a0e14]/97 border border-white/10 rounded-md px-[10px] py-2 min-w-[128px] max-w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_0_1px_rgba(240,120,64,0.08)] backdrop-blur-[12px]"
		style="
			left: {align === 'right' ? x - 14 : x + 14}px;
			top: {y}px;
			transform: translateX({align === 'right' ? '-100%' : '0'}) translateY(-50%);
		"
		role="tooltip"
	>
		{#if title}
			<div class="font-mono text-[9px] tracking-[0.04em] text-text-muted mb-[6px] pb-[5px] border-b border-white/[0.08] whitespace-nowrap">{title}</div>
		{/if}
		{#each items as item, idx}
			<div class="flex items-center gap-[6px] {idx > 0 ? 'mt-1' : ''}">
				{#if item.color}
					<span class="w-2 h-2 rounded-[2px] shrink-0" style="background:{item.color}"></span>
				{/if}
				<div class="flex justify-between items-baseline gap-2 flex-1 min-w-0">
					<span class="text-[10px] text-text-secondary truncate">{item.label}</span>
					<span class="font-mono text-[11px] font-semibold text-text-primary whitespace-nowrap shrink-0">{item.value}</span>
				</div>
			</div>
			{#if item.sub}
				<div class="text-[9px] text-text-muted ml-[14px] mt-[1px] italic">{item.sub}</div>
			{/if}
		{/each}
	</div>
{/if}
