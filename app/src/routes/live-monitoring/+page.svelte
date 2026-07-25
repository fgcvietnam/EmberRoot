<script lang="ts">
	import { api, type ApiTelemetry } from '$lib/api';
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';

	const nodes = $derived($selectedRegionId === 'all' ? operations.nodes : operations.nodes.filter((node) => node.region_id === $selectedRegionId));
	let nodeId = $state('');
	let telemetry = $state<ApiTelemetry[]>([]);
	let loadingTelemetry = $state(false);
	let telemetryError = $state<string | null>(null);
	const node = $derived(nodes.find((item) => item.id === nodeId));
	const latest = $derived(telemetry[0] ?? null);

	async function loadTelemetry(id: string) {
		if (!id) return;
		loadingTelemetry = true;
		try { telemetry = await api.getTelemetry(id, 50); telemetryError = null; }
		catch (error) { telemetryError = error instanceof Error ? error.message : 'Unable to load telemetry.'; }
		finally { loadingTelemetry = false; }
	}
	$effect(() => { if (!nodeId && nodes[0]) nodeId = nodes[0].id; });
	$effect(() => { if (nodeId) void loadTelemetry(nodeId); });
	$effect(() => {
		const event = operations.latestEvent;
		if (event?.type === 'telemetry.created' && event.payload) {
			const p = event.payload as any;
			const newTelemetry = {
				id: p.id,
				node_id: p.node_id ?? p.nodeId,
				received_at: p.received_at ?? p.receivedAt,
				ambient_temp: p.ambient_temp ?? p.ambientTemp,
				ambient_rh: p.ambient_rh ?? p.ambientRh,
				co: p.co,
				co2: p.co2,
				ch4: p.ch4,
				moisture: p.moisture,
				water_table: p.water_table ?? p.waterTable,
				battery_pct: p.battery_pct ?? p.batteryPct,
				battery_v: p.battery_v ?? p.batteryV,
				signal_rssi: p.signal_rssi ?? p.signalRssi,
				signal_snr: p.signal_snr ?? p.signalSnr,
			} as ApiTelemetry;
			if (newTelemetry.node_id === nodeId && !telemetry.some(t => t.id === newTelemetry.id)) {
				telemetry = [newTelemetry, ...telemetry].slice(0, 50);
			}
		}
	});
	const readings = [
		{ label: 'Ambient temperature', key: 'ambient_temp', unit: '°C' }, { label: 'Relative humidity', key: 'ambient_rh', unit: '%' },
		{ label: 'Carbon monoxide', key: 'co', unit: 'ppm' }, { label: 'Carbon dioxide', key: 'co2', unit: 'ppm' },
		{ label: 'Methane', key: 'ch4', unit: 'ppm' }, { label: 'Moisture', key: 'moisture', unit: '%' }
	] as const;
	function value(key: keyof ApiTelemetry) { const raw = latest?.[key]; return typeof raw === 'number' ? `${raw.toLocaleString(undefined, { maximumFractionDigits: 1 })}` : '—'; }
</script>

<section class="max-w-[1440px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	<header class="flex justify-between gap-6 items-end mb-7 max-sm:grid max-sm:items-start">
		<div>
			<p class="m-0 mb-1.5 text-brand text-[0.75rem] font-extrabold tracking-[0.08em] uppercase">Live data</p>
			<h1 class="m-0 text-[2rem] tracking-[-0.04em]">Latest field telemetry</h1>
			<p class="m-0 mt-1.5 text-text-muted">Measurements are ordered by the API's received timestamp.</p>
		</div>
		<label class="grid gap-1.5 text-text-muted text-[0.76rem] font-bold">
			Node
			<select bind:value={nodeId} onchange={() => void loadTelemetry(nodeId)}
				class="min-w-[15rem] h-10 px-2.5 border border-border rounded-[0.45rem] bg-card text-ink max-sm:min-w-0 max-sm:w-full">
				{#each nodes as item}<option value={item.id}>{item.name} · {item.id}</option>{/each}
			</select>
		</label>
	</header>

	{#if operations.loading}<LoadingState />{:else if !nodes.length}
		<div class="p-12 border border-dashed border-border rounded-[0.65rem] text-text-muted text-center">There are no nodes in the selected region.</div>
	{:else}
		<div class="flex justify-between items-center mb-4 px-[1.15rem] py-4 border border-border rounded-[0.65rem] bg-card">
			<div class="grid gap-[0.15rem]">
				<strong class="text-ink">{node?.name}</strong>
				<span class="font-mono text-text-muted text-[0.74rem]">{node?.id} · firmware {node?.firmware_version ?? 'not reported'}</span>
			</div>
			{#if node}<StatusPill status={node.status} />{/if}
		</div>

		{#if loadingTelemetry}<LoadingState label="Loading telemetry…" />
		{:else if telemetryError}
			<div class="p-12 border border-danger/40 rounded-[0.65rem] bg-danger/10 text-danger text-center">{telemetryError}</div>
		{:else if !latest}
			<div class="p-12 border border-dashed border-border rounded-[0.65rem] text-text-muted text-center">This node has not reported telemetry yet.</div>
		{:else}
			<div class="grid grid-cols-6 gap-3 mb-4 max-lg:grid-cols-3 max-sm:grid-cols-2">
				{#each readings as reading}
					<article class="border border-border rounded-[0.65rem] bg-card p-[0.95rem]">
						<span class="text-text-muted text-[0.72rem] font-[650]">{reading.label}</span>
						<strong class="block mt-[0.45rem] font-mono text-[1.25rem] tracking-[-0.06em]">
							{value(reading.key)}<small class="ml-[0.18rem] text-text-muted font-sans text-[0.68rem] tracking-normal">{latest[reading.key] === null ? '' : reading.unit}</small>
						</strong>
					</article>
				{/each}
			</div>

			<section class="border border-border rounded-[0.65rem] bg-card overflow-hidden">
				<div class="flex justify-between px-[1.15rem] py-4 border-b border-border">
					<h2 class="m-0 text-[0.95rem]">Recent readings</h2>
					<p class="m-0 text-text-muted text-[0.78rem]">{telemetry.length} received records</p>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full table-fixed border-collapse whitespace-nowrap text-[0.82rem]">
						<thead><tr>
							{#each ['Received','Ambient','Humidity','CO','CO₂','Battery','Signal'] as h}
								<th class="px-4 py-[0.7rem] bg-surface-subtle text-text-muted text-[0.68rem] tracking-[0.05em] text-left uppercase">{h}</th>
							{/each}
						</tr></thead>
						<tbody>
							{#each telemetry as item}
								<tr>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(item.received_at))}</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.ambient_temp ?? '—'} °C</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.ambient_rh ?? '—'}%</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.co ?? '—'}</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.co2 ?? '—'}</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.battery_pct === null ? '—' : `${Math.round(item.battery_pct)}%`}</td>
									<td class="px-4 py-[0.8rem] border-t border-border text-ink">{item.signal_rssi === null ? '—' : `${Math.round(item.signal_rssi)} dBm`}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}
	{/if}
</section>
