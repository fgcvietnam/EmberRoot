<script lang="ts">
	import { page } from '$app/state';
	import { api, type ApiTelemetry } from '$lib/api';
	import { operations } from '$lib/stores/operations.svelte';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';
	const id = $derived(page.params.nodeId); const node = $derived(operations.nodes.find((item)=>item.id===id));
	let telemetry = $state<ApiTelemetry[]>([]); let telemetryError=$state<string|null>(null);
	$effect(()=>{ if(id) void api.getTelemetry(id,20).then((data)=>{telemetry=data;telemetryError=null;}).catch((e)=>telemetryError=e instanceof Error?e.message:'Unable to load telemetry.'); });
	const latest=$derived(telemetry[0]);
</script>

<section class="max-w-[1050px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	{#if operations.loading}<LoadingState />
	{:else if !node}
		<div class="py-16 px-4 text-center">
			<h1 class="m-0 mb-4 text-[2rem] tracking-[-0.04em]">Node not found</h1>
			<a href="/sensor-network" class="text-brand-dark no-underline hover:underline">Return to nodes</a>
		</div>
	{:else}
		<a class="text-brand-dark text-[0.82rem] font-[750] no-underline hover:underline" href="/sensor-network">← Field nodes</a>
		<header class="flex justify-between gap-4 my-6 max-sm:grid">
			<div>
				<p class="m-0 mb-1.5 text-brand font-mono text-[0.72rem]">{node.id}</p>
				<h1 class="m-0 text-[2rem] tracking-[-0.04em]">{node.name}</h1>
				<p class="m-0 mt-1.5 text-text-muted">{operations.regions.find((r)=>r.id===node.region_id)?.name ?? node.region_id} · {node.node_type} node</p>
			</div>
			<StatusPill status={node.status}/>
		</header>

		<div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
			<section class="p-5 border border-border rounded-[0.65rem] bg-card">
				<h2 class="m-0 mb-4 text-[0.95rem]">Device details</h2>
				<dl class="grid gap-3 m-0">
					{#each [
						{label:'Firmware', value:node.firmware_version ?? 'Not reported'},
						{label:'Battery', value:`${node.battery_pct === null ? '—' : `${Math.round(node.battery_pct)}%`} ${node.battery_v === null ? '' : `(${node.battery_v.toFixed(2)} V)`}`},
						{label:'Signal', value:node.signal_rssi === null ? '—' : `${Math.round(node.signal_rssi)} dBm`},
						{label:'Coordinates', value:node.latitude === null || node.longitude === null ? 'Not set' : `${node.latitude.toFixed(5)}, ${node.longitude.toFixed(5)}`},
						{label:'Last check-in', value:node.last_seen_at ? new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(node.last_seen_at)) : 'Never'},
					] as entry}
						<div class="flex justify-between gap-4 pt-3 border-t border-border">
							<dt class="text-text-muted text-[0.8rem]">{entry.label}</dt>
							<dd class="m-0 text-ink font-mono text-[0.75rem] text-right">{entry.value}</dd>
						</div>
					{/each}
				</dl>
			</section>

			<section class="p-5 border border-border rounded-[0.65rem] bg-card">
				<h2 class="m-0 mb-4 text-[0.95rem]">Latest telemetry</h2>
				{#if telemetryError}
					<p class="text-danger text-[0.85rem]">{telemetryError}</p>
				{:else if !latest}
					<p class="text-text-muted text-[0.85rem]">No received telemetry for this node.</p>
				{:else}
					<dl class="grid gap-3 m-0">
						{#each [
							{label:'Ambient temperature', value:`${latest.ambient_temp ?? '—'} °C`},
							{label:'Humidity', value:`${latest.ambient_rh ?? '—'}%`},
							{label:'CO / CO₂', value:`${latest.co ?? '—'} / ${latest.co2 ?? '—'} ppm`},
							{label:'Received', value:new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(latest.received_at))},
						] as entry}
							<div class="flex justify-between gap-4 pt-3 border-t border-border">
								<dt class="text-text-muted text-[0.8rem]">{entry.label}</dt>
								<dd class="m-0 text-ink font-mono text-[0.75rem] text-right">{entry.value}</dd>
							</div>
						{/each}
					</dl>
				{/if}
			</section>
		</div>
	{/if}
</section>
