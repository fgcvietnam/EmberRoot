<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';

	const regionId = $derived($selectedRegionId);
	const nodes = $derived(regionId === 'all' ? operations.nodes : operations.nodes.filter((node) => node.region_id === regionId));
	const alerts = $derived(regionId === 'all' ? operations.alerts : operations.alerts.filter((alert) => alert.region_id === regionId));
	const online = $derived(nodes.filter((node) => node.status === 'online').length);
	const needsAttention = $derived(nodes.filter((node) => ['warning', 'critical', 'offline'].includes(node.status)).length);
	const openAlerts = $derived(alerts.filter((alert) => alert.state === 'open' || alert.state === 'investigating').length);
	const lastUpdated = $derived(operations.lastUpdated ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(operations.lastUpdated) : '—');
	function relativeTime(value: string | null): string {
		if (!value) return 'No check-in recorded';
		const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
		return minutes < 1 ? 'Just now' : minutes < 60 ? `${minutes} min ago` : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
	}
</script>

{#if operations.loading}
	<LoadingState />
{:else}
	<section class="max-w-[1440px] mx-auto p-4 sm:px-11 sm:py-10 sm:pb-16 overflow-x-hidden">
		<header class="grid sm:flex justify-between gap-4 sm:gap-8 items-start mb-9">
			<div>
				<p class="m-0 mb-1.8 text-brand text-[0.76rem] font-extrabold tracking-[0.08em] uppercase">Operations overview</p>
				<h1 class="m-0 text-[clamp(1.7rem,3vw,2.35rem)] tracking-[-0.045em] leading-[1.14]">Forest conditions, as reported</h1>
				<p class="m-0 mt-2.4 text-text-muted">Live inventory and alert state from the EmberRoot monitoring API.</p>
			</div>
			<div class="flex items-center gap-2 pt-1.2 text-text-muted text-[0.78rem] whitespace-nowrap">
				<span class="w-[0.48rem] h-[0.48rem] rounded-full {operations.error ? 'bg-danger' : 'bg-success'}"></span>
				{operations.error ? operations.error : `Updated ${lastUpdated}`}
				<button type="button" class="ml-1 border-0 bg-transparent text-brand-dark text-inherit font-bold underline cursor-pointer" onclick={() => void operations.refresh()}>Refresh</button>
			</div>
		</header>

		{#if operations.error}
			<div class="-mt-4 mb-5 p-[0.85rem_1rem] border border-[#f85149]/40 rounded-[0.55rem] bg-[#f85149]/10 text-[#ffa19c] text-[0.9rem]" role="alert">
				<strong>Data could not be loaded.</strong> Check the API deployment or your connection, then retry.
			</div>
		{/if}

		<!-- stat cards: 2-up on mobile, 4-up only at xl (accounts for 13.75rem sidebar) -->
		<div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5" aria-label="Operational summary">
			<article class="border border-border rounded-[0.7rem] bg-card p-4 sm:p-[1.1rem_1.2rem] min-w-0">
				<span class="text-text-muted text-[0.78rem] font-bold">Nodes reporting</span>
				<strong class="block my-2 mb-1 text-ink font-mono text-[1.8rem] tracking-[-0.08em]">{online}<small class="text-text-muted font-sans text-[0.78rem] font-semibold tracking-normal"> / {nodes.length}</small></strong>
				<p class="m-0 text-text-muted font-sans text-[0.78rem] font-medium">Current online node count</p>
			</article>
			<article class="border border-border rounded-[0.7rem] bg-card p-4 sm:p-[1.1rem_1.2rem] min-w-0">
				<span class="text-text-muted text-[0.78rem] font-bold">Needs attention</span>
				<strong class="block my-2 mb-1 font-mono text-[1.8rem] tracking-[-0.08em] {needsAttention > 0 ? 'text-danger' : 'text-ink'}">{needsAttention}</strong>
				<p class="m-0 text-text-muted font-sans text-[0.78rem] font-medium">Offline, warning, or critical</p>
			</article>
			<article class="border border-border rounded-[0.7rem] bg-card p-4 sm:p-[1.1rem_1.2rem] min-w-0">
				<span class="text-text-muted text-[0.78rem] font-bold">Open alerts</span>
				<strong class="block my-2 mb-1 font-mono text-[1.8rem] tracking-[-0.08em] {openAlerts > 0 ? 'text-danger' : 'text-ink'}">{openAlerts}</strong>
				<p class="m-0 text-text-muted font-sans text-[0.78rem] font-medium">Awaiting a response</p>
			</article>
			<article class="border border-border rounded-[0.7rem] bg-card p-4 sm:p-[1.1rem_1.2rem] min-w-0">
				<span class="text-text-muted text-[0.78rem] font-bold">Regions in view</span>
				<strong class="block my-2 mb-1 text-ink font-mono text-[1.8rem] tracking-[-0.08em]">{regionId === 'all' ? operations.regions.length : 1}</strong>
				<p class="m-0 text-text-muted font-sans text-[0.78rem] font-medium">Current operating context</p>
			</article>
		</div>

		<!-- two-column panel: stacked until xl, then side-by-side -->
		<div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
			<!-- Node status -->
			<section class="border border-border rounded-[0.7rem] bg-card min-w-0 overflow-hidden">
				<div class="flex justify-between items-start gap-4 p-[1.2rem_1.2rem_1rem] border-b border-border">
					<div>
						<h2 class="m-0 text-base tracking-[-0.02em]">Node status</h2>
						<p class="m-0 mt-1 text-text-muted text-[0.78rem]">Most recently heard from first</p>
					</div>
					<a href="/sensor-network" class="text-brand-dark text-xs font-bold no-underline hover:underline shrink-0 mt-0.5">View all nodes</a>
				</div>
				{#if nodes.length}
					<div class="overflow-x-auto">
						<table class="w-full table-fixed border-collapse text-[0.83rem]">
							<thead><tr>
								{#each ['Node', 'Region', 'Status', 'Power', 'Last check-in'] as h}
									<th class="px-4 py-[0.72rem] text-text-muted bg-surface-subtle text-[0.7rem] font-bold tracking-[0.04em] text-left uppercase">{h}</th>
								{/each}
							</tr></thead>
							<tbody>
								{#each nodes.slice(0, 8) as node}
									<tr>
										<td class="px-4 py-3 border-t border-border text-ink">
											<a class="grid text-ink font-bold no-underline hover:text-brand" href={'/spatial-map/node/' + encodeURIComponent(node.id)}>
												{node.name}
												<small class="mt-0.5 text-text-muted font-mono text-[0.68rem] font-normal">{node.id} · {node.node_type}</small>
											</a>
										</td>
										<td class="px-4 py-3 border-t border-border text-ink whitespace-nowrap">{operations.regions.find((r) => r.id === node.region_id)?.name ?? node.region_id}</td>
										<td class="px-4 py-3 border-t border-border text-ink whitespace-nowrap"><StatusPill status={node.status} /></td>
										<td class="px-4 py-3 border-t border-border text-ink whitespace-nowrap">{node.battery_pct === null ? '—' : `${Math.round(node.battery_pct)}%`}</td>
										<td class="px-4 py-3 border-t border-border text-ink whitespace-nowrap">{relativeTime(node.last_seen_at)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="grid gap-1 p-[2.5rem_1.2rem] text-text-muted text-center text-[0.85rem]">
						<strong class="text-ink">No nodes in this view.</strong>
						<span>Register a node as an administrator, then begin telemetry ingestion.</span>
					</div>
				{/if}
			</section>

			<!-- Alert queue -->
			<section class="border border-border rounded-[0.7rem] bg-card min-w-0 overflow-hidden">
				<div class="flex justify-between items-start gap-4 p-[1.2rem_1.2rem_1rem] border-b border-border">
					<div>
						<h2 class="m-0 text-base tracking-[-0.02em]">Alert queue</h2>
						<p class="m-0 mt-1 text-text-muted text-[0.78rem]">Newest alerts first</p>
					</div>
					<a href="/alert-history" class="text-brand-dark text-xs font-bold no-underline hover:underline shrink-0 mt-0.5">Open queue</a>
				</div>
				{#if alerts.length}
					<ul class="grid m-0 p-0 list-none">
						{#each alerts.slice(0, 5) as alert}
							<li class="flex justify-between gap-3 p-[1rem_1.2rem] border-t border-border first:border-t-0">
								<div class="min-w-0">
									<a class="text-ink text-[0.85rem] font-bold no-underline hover:text-brand truncate block" href={'/alerts/' + encodeURIComponent(alert.id)}>{alert.node_name ?? alert.node_id}</a>
									<p class="line-clamp-2 m-0 mt-1 text-text-muted text-[0.78rem]">{alert.explanation}</p>
									<time class="block mt-1.5 text-text-muted text-[0.7rem]">{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(alert.created_at))}</time>
								</div>
								<StatusPill status={alert.state} />
							</li>
						{/each}
					</ul>
				{:else}
					<div class="grid gap-1 p-[2.5rem_1.2rem] text-text-muted text-center text-[0.85rem]">
						<strong class="text-ink">No alerts in this view.</strong>
						<span>New alerts will appear here when telemetry exceeds a defined threshold.</span>
					</div>
				{/if}
			</section>
		</div>
	</section>
{/if}
