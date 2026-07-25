<!-- HeatmapGrid.svelte
  Calendar-style heatmap — 7 days × 48 half-hour slots.
  Each cell's colour encodes the reading intensity.
  Hovering a cell shows exact value + timestamp in a floating tooltip.

  Props:
    data        — TimeSeries with 336 points (7d × 48 slots)
    title       — chart title
    unit        — value unit suffix
    colorHigh   — CSS colour for highest values (default ember orange)
    colorLow    — CSS colour for lowest values (default transparent blue)
    formatValue — optional value formatter
-->
<script lang="ts">
	import type { TimeSeries } from '$lib/mock';

	interface Props {
		data: TimeSeries;
		title?: string;
		unit?: string;
		colorHigh?: string;
		colorLow?: string;
		formatValue?: (n: number) => string;
	}

	let {
		data,
		title = '',
		unit = '',
		colorHigh = '#f97316',
		colorLow = '#0f172a',
		formatValue = (n) => n.toFixed(1)
	}: Props = $props();

	// ── Grid construction ───────────────────────────────────────────────────────
	// Expects 336-point series (7 days × 48 slots of 30 min).
	// Pad or trim to exactly 336 points.

	const DAYS    = 7;
	const SLOTS   = 48; // 30-min slots per day

	// Build a 7×48 grid from the series.
	const grid = $derived((): { value: number; ts: number }[][] => {
		const pts = data.slice(-DAYS * SLOTS);
		const rows: { value: number; ts: number }[][] = [];
		for (let d = 0; d < DAYS; d++) {
			const row: { value: number; ts: number }[] = [];
			for (let s = 0; s < SLOTS; s++) {
				const idx = d * SLOTS + s;
				row.push({ value: pts[idx]?.value ?? 0, ts: pts[idx]?.timestamp ?? 0 });
			}
			rows.push(row);
		}
		return rows;
	});

	// Compute min/max for colour interpolation
	const minVal = $derived(Math.min(...data.map((p) => p.value)));
	const maxVal = $derived(Math.max(...data.map((p) => p.value)));

	function norm(v: number) {
		const range = maxVal - minVal;
		return range === 0 ? 0.5 : (v - minVal) / range;
	}

	// Interpolate between two hex colours
	function hexToRgb(hex: string) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return [r, g, b];
	}

	function parseColor(c: string): [number, number, number] {
		if (c.startsWith('#') && c.length === 7) return hexToRgb(c) as [number, number, number];
		return [100, 100, 100];
	}

	const rgbLow  = $derived(parseColor(colorLow));
	const rgbHigh = $derived(parseColor(colorHigh));

	function cellColor(v: number) {
		const t = norm(v);
		const r = Math.round(rgbLow[0] + (rgbHigh[0] - rgbLow[0]) * t);
		const g = Math.round(rgbLow[1] + (rgbHigh[1] - rgbLow[1]) * t);
		const b = Math.round(rgbLow[2] + (rgbHigh[2] - rgbLow[2]) * t);
		return `rgb(${r},${g},${b})`;
	}

	// ── Tooltip state ───────────────────────────────────────────────────────────
	let tipVisible = $state(false);
	let tipX = $state(0);
	let tipY = $state(0);
	let tipValue = $state('');
	let tipTime = $state('');

	function fmtTs(ts: number) {
		const d = new Date(ts);
		return d.toLocaleString(undefined, {
			weekday: 'short', month: 'short', day: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	function onEnter(e: MouseEvent, value: number, ts: number) {
		tipVisible = true;
		tipValue = `${formatValue(value)}${unit}`;
		tipTime = ts ? fmtTs(ts) : '—';
		tipX = (e.currentTarget as HTMLElement).getBoundingClientRect().left + window.scrollX;
		tipY = (e.currentTarget as HTMLElement).getBoundingClientRect().top + window.scrollY;
	}

	function onLeave() {
		tipVisible = false;
	}

	// ── Day labels ──────────────────────────────────────────────────────────────
	const DAY_LABELS = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];

	// Column labels: every 6 hours → 8 labels
	const COL_LABELS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
</script>
<div class="flex flex-col gap-2 w-full">
	{#if title}
		<div class="text-[12px] font-bold text-text-secondary">{title}</div>
	{/if}

	<div class="relative h-[14px] pl-[64px]" aria-hidden="true">
		<div class="inline-block"></div>
		{#each COL_LABELS as label, i}
			<div class="absolute text-[9px] text-text-muted -translate-x-1/2 whitespace-nowrap" style="left:{(i / 8 * 100).toFixed(1)}%">{label}</div>
		{/each}
	</div>

	<div class="flex flex-col gap-[2px]" role="img" aria-label="{title} heatmap">
		{#each grid() as row, dayIdx}
			<div class="flex items-center gap-2">
				<div class="w-[56px] shrink-0 text-[9px] text-text-muted text-right whitespace-nowrap" aria-hidden="true">{DAY_LABELS[dayIdx]}</div>
				<div class="flex gap-[1.5px] flex-1">
					{#each row as cell}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="flex-1 h-[14px] rounded-[2px] cursor-crosshair transition-opacity duration-100 hover:opacity-75 hover:outline hover:outline-1 hover:outline-white/40 hover:outline-offset-1 hover:rounded-[1px]"
							style="background:{cellColor(cell.value)}"
							onmouseenter={(e) => onEnter(e, cell.value, cell.ts)}
							onmouseleave={onLeave}
						></div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<!-- Scale bar -->
	<div class="flex items-center gap-2 pl-[64px]" aria-hidden="true">
		<span class="text-[9px] text-text-muted whitespace-nowrap">{formatValue(minVal)}{unit}</span>
		<div class="flex-1 h-1 rounded-[2px]" style="background:linear-gradient(to right,{colorLow},{colorHigh})"></div>
		<span class="text-[9px] text-text-muted whitespace-nowrap">{formatValue(maxVal)}{unit}</span>
	</div>
</div>

<!-- Floating tooltip rendered at document level -->
{#if tipVisible}
	<div
		class="fixed z-[9999] bg-[#0f172a]/95 border border-white/[0.14] rounded-lg px-[10px] py-[6px] pointer-events-none -translate-x-1/2 -translate-y-full"
		style="top:{tipY - 56}px; left:{tipX}px"
		role="tooltip"
	>
		<div class="text-[13px] font-bold text-text-primary font-mono">{tipValue}</div>
		<div class="text-[10px] text-text-muted mt-[2px]">{tipTime}</div>
	</div>
{/if}
