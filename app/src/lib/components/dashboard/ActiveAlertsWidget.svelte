<!-- ActiveAlertsWidget — uses BarChart for severity breakdown -->
<script lang="ts">
	import { mockService } from '$lib/mock';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import type { BarDef } from '$lib/components/charts';
	import Badge from '$lib/components/ui/Badge.svelte';
	import StatusIndicator from '$lib/components/ui/StatusIndicator.svelte';

	const alerts   = mockService.getActiveAlerts();
	const critical = alerts.filter(a => a.severity === 'critical').length;
	const high     = alerts.filter(a => a.severity === 'high').length;
	const medium   = alerts.filter(a => a.severity === 'medium').length;
	const low      = alerts.filter(a => a.severity === 'low').length;
	const unack    = mockService.getUnacknowledgedAlerts().length;

	const bars: BarDef[] = [
		{ id: 'critical', label: 'Critical', value: critical, color: 'var(--status-critical)', sub: 'Immediate action required' },
		{ id: 'high',     label: 'High',     value: high,     color: 'var(--status-warning)',  sub: 'Prompt attention needed' },
		{ id: 'medium',   label: 'Medium',   value: medium,   color: 'var(--text-secondary)',  sub: 'Monitor closely' },
		{ id: 'low',      label: 'Low',      value: low,      color: 'var(--surface-muted)',   sub: 'Informational' },
	];

	let selected = $state<BarDef | null>(null);
</script>



<div class="flex flex-col gap-[14px] h-full">
	<div class="flex items-start justify-between">
		<div class="flex flex-col gap-[3px]">
			<div class="flex items-center gap-[6px]">
				{#if critical > 0}<StatusIndicator status="critical" pulse size="md" />{/if}
				<span class="text-[12px] font-semibold tracking-[0.06em] uppercase text-text-primary">Active Alerts</span>
			</div>
			<span class="text-[10px] text-text-muted">Unacknowledged: {unack}</span>
		</div>
		<span class="font-mono text-[44px] font-extrabold leading-none tracking-[-2px] text-text-primary">{alerts.length}</span>
	</div>

	<BarChart {bars} orientation="horizontal" showValues
		onBarClick={(b) => selected = selected?.id === b.id ? null : b} />

	{#if selected}
		<div class="flex items-center justify-between px-[10px] py-[7px] rounded-md bg-surface-raised border border-surface-border text-[11px]">
			<span class="text-text-secondary">{selected.label} alerts</span>
			<span class="font-mono text-[18px] font-bold" style="color:{selected.color}">{selected.value}</span>
		</div>
	{/if}

	<div class="flex items-center justify-between mt-auto">
		<a href="/alert-history" class="inline-flex items-center gap-1 text-[11px] text-ember-300 no-underline font-medium transition-colors duration-150 hover:text-ember-200">
			View all
			<svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
			</svg>
		</a>
		{#if critical > 0}<Badge variant="critical">{critical} critical</Badge>{/if}
	</div>
</div>
