

<!-- ForestHealthWidget — SparklineChart (7-day trend) + BarChart (risk factors) -->
<script lang="ts">
	import { mockService } from '$lib/mock';
	import SparklineChart from '$lib/components/charts/SparklineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import type { BarDef } from '$lib/components/charts';
	import type { TimeSeries } from '$lib/mock';

	const risks      = mockService.getAllRiskIndices();
	const avgRisk    = risks.reduce((s, r) => s + r.composite, 0) / (risks.length || 1);
	const health     = Math.max(0, Math.min(100, Math.round(100 - avgRisk)));
	const level      = health >= 70 ? 'Good' : health >= 45 ? 'Moderate' : 'Poor';
	const variant    = health >= 70 ? 'online' : health >= 45 ? 'warning' : 'critical';

	// 7-day health sparkline from first region's risk history (inverted)
	const first = risks[0];
	const sparkSeries: TimeSeries = first
		? first.history.slice(-7).map(p => ({ timestamp: p.timestamp, value: Math.round(100 - p.value) }))
		: [];

	// Risk factor bars
	const factorBars: BarDef[] = first ? [
		{ id: 'fuel',  label: 'Fuel Moisture', value: Math.round(first.factors.fuelMoisture.score),
			color: first.factors.fuelMoisture.score > 65 ? 'var(--status-critical)' : 'var(--status-warning)',
			sub: `Trend: ${first.factors.fuelMoisture.trend}` },
		{ id: 'wind',  label: 'Wind Exposure', value: Math.round(first.factors.windExposure.score),
			color: first.factors.windExposure.score > 65 ? 'var(--status-critical)' : 'var(--ember-400)',
			sub: `Trend: ${first.factors.windExposure.trend}` },
		{ id: 'temp',  label: 'Temperature',   value: Math.round(first.factors.temperature.score),
			color: first.factors.temperature.score > 65 ? 'var(--status-critical)' : 'var(--ember-300)',
			sub: `Trend: ${first.factors.temperature.trend}` },
	] : [];

	const COLOR: Record<string, string> = {
		online: 'var(--status-online)', warning: 'var(--status-warning)', critical: 'var(--status-critical)'
	};

	const iconVariantStyles: Record<string, string> = {
		online: 'bg-[rgba(34,211,160,0.12)] border-[rgba(34,211,160,0.25)] text-status-online',
		warning: 'bg-[rgba(240,179,64,0.12)] border-[rgba(240,179,64,0.25)] text-status-warning',
		critical: 'bg-[rgba(240,80,80,0.12)] border-[rgba(240,80,80,0.25)] text-status-critical'
	};

	const textVariantStyles: Record<string, string> = {
		online: 'text-status-online',
		warning: 'text-status-warning',
		critical: 'text-status-critical'
	};
</script>

<div class="flex flex-col gap-[14px] h-full">
	<div class="flex items-center gap-[10px]">
		<div class="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 {iconVariantStyles[variant]}">
			<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"/>
			</svg>
		</div>
		<div>
			<div class="text-[12px] font-semibold tracking-[0.06em] uppercase text-text-primary">Forest Health</div>
			<div class="text-[10px] text-text-muted">Composite risk-adjusted index</div>
		</div>
	</div>

	<div class="flex items-baseline gap-2">
		<span class="font-mono text-[42px] font-extrabold leading-none tracking-[-2px] {textVariantStyles[variant]}">{health}</span>
		<div>
			<div class="text-[11px] font-bold uppercase tracking-[0.06em] {textVariantStyles[variant]}">{level}</div>
			<div class="text-[11px] text-text-muted">/ 100</div>
		</div>
	</div>

	{#if sparkSeries.length >= 3}
		<div>
			<SparklineChart
				data={sparkSeries} color={COLOR[variant]}
				unit="/100" height={40}
				formatValue={(n) => n.toFixed(0)}
				formatTime={(ts) => { const d = new Date(ts); return `${d.getMonth()+1}/${d.getDate()}`; }}
			/>
			<p class="text-[9px] text-text-muted mt-[3px] mb-0 uppercase tracking-[0.06em]">7-day health trend</p>
		</div>
	{/if}

	{#if factorBars.length > 0}
		<BarChart bars={factorBars} orientation="horizontal" showValues />
	{/if}
</div>
