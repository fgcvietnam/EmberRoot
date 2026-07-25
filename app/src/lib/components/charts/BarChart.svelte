<!-- ──────────────────────────────────────────────────────────────────────────
  BarChart.svelte — Interactive horizontal / vertical bar chart.

  Features:
  · Hover: bar brightens + scale expand + glow shadow
  · Tooltip on hover (value, label, sub-note)
  · Click to select/deselect a bar → onBarClick callback
  · Smooth fill animation via CSS transition
  · Responsive via container flex layout
────────────────────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import ChartTooltip from './ChartTooltip.svelte';
	import type { TooltipItem, BarDef } from './types.js';

	interface Props {
		bars: BarDef[];
		orientation?: 'horizontal' | 'vertical';
		unit?: string;
		showValues?: boolean;
		maxValue?: number;
		formatValue?: (n: number) => string;
		onBarClick?: (bar: BarDef) => void;
	}

	let {
		bars,
		orientation = 'horizontal',
		unit = '',
		showValues = true,
		maxValue,
		formatValue = (n) => n % 1 === 0 ? String(n) : n.toFixed(1),
		onBarClick
	}: Props = $props();

	const PALETTE = [
		'var(--ember-400)', 'var(--status-online)',
		'var(--status-warning)', 'var(--status-critical)', 'var(--text-secondary)'
	];

	const resolvedMax = $derived(maxValue ?? Math.max(...bars.map(b => b.value), 1));
	function pct(v: number) { return Math.min(100, (v / resolvedMax) * 100); }

	// ── Hover / selection state ────────────────────────────────────────────────
	let hovId = $state<string|null>(null);
	let selId = $state<string|null>(null);
	let tipVis  = $state(false);
	let tipX = $state(0), tipY = $state(0);
	let tipItems = $state<TooltipItem[]>([]);
	let tipTitle = $state('');
	let wrapEl: HTMLDivElement;

	function enter(e: MouseEvent, bar: BarDef) {
		hovId = bar.id; tipVis = true;
		update(e, bar);
	}
	function leave() { hovId = null; tipVis = false; }
	function move(e: MouseEvent, bar: BarDef) { update(e, bar); }

	function update(e: MouseEvent, bar: BarDef) {
		const r = wrapEl.getBoundingClientRect();
		tipX = e.clientX - r.left;
		tipY = e.clientY - r.top;
		tipTitle = bar.label;
		tipItems = [{ label: 'Value', value: `${formatValue(bar.value)}${unit}`, color: bar.color ?? PALETTE[0], sub: bar.sub }];
	}

	function click(bar: BarDef) {
		selId = selId === bar.id ? null : bar.id;
		onBarClick?.(bar);
	}

	function color(bar: BarDef, i: number) { return bar.color ?? PALETTE[i % PALETTE.length]; }
</script>

<div class="relative w-full" bind:this={wrapEl}>
	{#if orientation === 'horizontal'}
		<div class="flex flex-col gap-[7px]">
			{#each bars as bar, i}
				{@const c = color(bar, i)}
				{@const p = pct(bar.value)}
				{@const hov = hovId === bar.id}
				{@const sel = selId === bar.id}
				<!-- svelte-ignore a11y_interactive_supports_focus -->
				<div class="grid grid-cols-[64px_1fr_auto] items-center gap-2">
					<span class="text-[10px] text-text-secondary uppercase tracking-wider truncate" title={bar.label}>{bar.label}</span>
					<div class="h-2 bg-surface-overlay rounded overflow-hidden cursor-pointer">
						<div
							class="h-full rounded transition-[width,filter,transform] duration-550 ease-[cubic-bezier(.4,0,.2,1)] origin-left {hov ? 'brightness-[1.3] scale-y-[1.35]' : ''} {sel ? 'outline-2 outline-current outline-offset-2 brightness-[1.45]' : ''}"
							style="width:{p}%; background:{c}; box-shadow:{hov ? `0 0 14px -2px ${c}` : 'none'}"
							role="button"
							tabindex="0"
							aria-label="{bar.label}: {formatValue(bar.value)}{unit}"
							onmouseenter={(e) => enter(e, bar)}
							onmouseleave={leave}
							onmousemove={(e) => move(e, bar)}
							onclick={() => click(bar)}
							onkeydown={(e) => e.key === 'Enter' && click(bar)}
						></div>
					</div>
					{#if showValues}
						<span class="font-mono text-[11px] font-semibold min-w-[36px] text-right" style="color:{c}">{formatValue(bar.value)}{unit}</span>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex items-end gap-2 h-[80px] w-full">
			{#each bars as bar, i}
				{@const c = color(bar, i)}
				{@const p = pct(bar.value)}
				{@const hov = hovId === bar.id}
				<!-- svelte-ignore a11y_interactive_supports_focus -->
				<div class="flex flex-col items-center gap-1 flex-1">
					{#if showValues}
						<span class="font-mono text-[10px] font-semibold" style="color:{c}">{formatValue(bar.value)}{unit}</span>
					{/if}
					<div class="w-full flex-1 bg-surface-overlay rounded-t flex items-end overflow-hidden cursor-pointer min-h-[50px]">
						<div
							class="w-full rounded-t transition-[height,filter,transform] duration-550 ease-[cubic-bezier(.4,0,.2,1)] origin-bottom {hov ? 'brightness-[1.3] scale-x-[1.06]' : ''}"
							style="height:{p}%; background:{c}; box-shadow:{hov ? `0 -4px 14px -2px ${c}` : 'none'}"
							role="button"
							tabindex="0"
							aria-label="{bar.label}: {formatValue(bar.value)}{unit}"
							onmouseenter={(e) => enter(e, bar)}
							onmouseleave={leave}
							onmousemove={(e) => move(e, bar)}
							onclick={() => click(bar)}
							onkeydown={(e) => e.key === 'Enter' && click(bar)}
						></div>
					</div>
					<span class="text-[9px] text-text-muted uppercase tracking-[0.04em] text-center">{bar.label}</span>
				</div>
			{/each}
		</div>
	{/if}

	<ChartTooltip
		visible={tipVis}
		x={tipX} y={tipY}
		title={tipTitle}
		items={tipItems}
		align={tipX > 160 ? 'right' : 'left'}
	/>
</div>

