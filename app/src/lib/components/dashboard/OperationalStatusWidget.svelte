<!-- ─────────────────────────────────────────────────────────────────────────
  OperationalStatusWidget.svelte
  Shows system-wide health: sensor online/offline counts + region risk totals.
───────────────────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import { mockService } from '$lib/mock';
	import StatusIndicator from '$lib/components/ui/StatusIndicator.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const stats = mockService.getSummaryStats();
	const regions = mockService.getRegions();
	const highRisk = regions.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high').length;
	const allOnline = stats.offlineSensors === 0 && stats.criticalSensors === 0;
	const systemLabel = stats.criticalAlerts > 0 ? 'Elevated' : allOnline ? 'All Systems Nominal' : 'Degraded';
	const systemStatus = stats.criticalAlerts > 0 ? 'critical' : allOnline ? 'online' : 'warning';
	const total = stats.totalSensors || 1;
</script>



<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<StatusIndicator status={systemStatus} pulse size="lg" />
			<span class="text-[13px] font-semibold text-text-primary tracking-[0.01em]">Operational Status</span>
		</div>
		<Badge variant={systemStatus === 'online' ? 'online' : systemStatus === 'warning' ? 'warning' : 'critical'}>
			{systemLabel}
		</Badge>
	</div>

	<div class="grid grid-cols-4 gap-3">
		<div class="flex flex-col gap-[3px]">
			<span class="font-mono text-[22px] font-bold leading-none text-status-online">{stats.onlineSensors}</span>
			<span class="text-[10px] font-medium tracking-[0.06em] uppercase text-text-muted">Online</span>
		</div>
		<div class="flex flex-col gap-[3px]">
			<span class="font-mono text-[22px] font-bold leading-none text-status-warning">{stats.warningSensors}</span>
			<span class="text-[10px] font-medium tracking-[0.06em] uppercase text-text-muted">Warning</span>
		</div>
		<div class="flex flex-col gap-[3px]">
			<span class="font-mono text-[22px] font-bold leading-none text-status-critical">{stats.offlineSensors + stats.criticalSensors}</span>
			<span class="text-[10px] font-medium tracking-[0.06em] uppercase text-text-muted">Offline/Crit</span>
		</div>
		<div class="flex flex-col gap-[3px]">
			<span class="font-mono text-[22px] font-bold leading-none text-ember-300">{highRisk}</span>
			<span class="text-[10px] font-medium tracking-[0.06em] uppercase text-text-muted">High Risk Zones</span>
		</div>
	</div>

	<!-- Sensor health bar -->
	<div class="flex flex-col gap-[6px]" title="Sensor fleet health distribution">
		<div class="flex h-[6px] rounded-[3px] overflow-hidden bg-surface-overlay gap-[1px]">
			<div class="h-full transition-[width] duration-600 ease-in-out bg-status-online"  style="width:{(stats.onlineSensors   /total*100).toFixed(1)}%"></div>
			<div class="h-full transition-[width] duration-600 ease-in-out bg-status-warning" style="width:{(stats.warningSensors  /total*100).toFixed(1)}%"></div>
			<div class="h-full transition-[width] duration-600 ease-in-out bg-status-critical"style="width:{((stats.criticalSensors+stats.offlineSensors)/total*100).toFixed(1)}%"></div>
		</div>
		<div class="flex items-center gap-[10px] text-[10px] text-text-muted">
			<span class="inline-block w-[7px] h-[7px] rounded-full bg-status-online"></span>Online
			<span class="inline-block w-[7px] h-[7px] rounded-full bg-status-warning"></span>Warning
			<span class="inline-block w-[7px] h-[7px] rounded-full bg-status-critical"></span>Critical/Offline
		</div>
	</div>

	<p class="flex items-center gap-[5px] text-[11px] text-text-muted m-0">
		<svg class="shrink-0 text-text-muted" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
		{stats.totalRegions} monitored regions — {highRisk} at elevated risk
	</p>
</div>
