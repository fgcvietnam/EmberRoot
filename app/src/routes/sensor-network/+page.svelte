<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';
	let query = $state('');
	const nodes = $derived(($selectedRegionId === 'all' ? operations.nodes : operations.nodes.filter((node) => node.region_id === $selectedRegionId)).filter((node) => `${node.name} ${node.id}`.toLowerCase().includes(query.toLowerCase())));
	function seen(value: string | null) { return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Never'; }
</script>

<section class="max-w-[1440px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	<header class="flex justify-between gap-6 items-end mb-7 max-sm:grid max-sm:items-start">
		<div>
			<p class="m-0 mb-1.5 text-brand text-[0.75rem] font-extrabold tracking-[0.08em] uppercase">Node inventory</p>
			<h1 class="m-0 text-[2rem] tracking-[-0.04em]">Field nodes</h1>
			<p class="m-0 mt-1.5 text-text-muted">{nodes.length} nodes match the current filter.</p>
		</div>
		<input bind:value={query} placeholder="Search name or ID" aria-label="Search nodes"
			class="w-[15rem] h-10 px-3 border border-border rounded-[0.45rem] bg-card text-ink max-sm:w-full" />
	</header>

	{#if operations.loading}<LoadingState />{:else}
		<section class="border border-border rounded-[0.65rem] bg-card overflow-hidden">
			<div class="overflow-auto">
				<table class="w-full border-collapse whitespace-nowrap text-[0.83rem]">
					<thead><tr>
						{#each ['Node','Region','Type','Status','Location','Battery','Last check-in'] as h}
							<th class="px-[1.1rem] py-[0.72rem] bg-surface-subtle text-text-muted text-[0.68rem] tracking-[0.05em] text-left uppercase">{h}</th>
						{/each}
					</tr></thead>
					<tbody>
						{#each nodes as node}
							<tr>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">
									<a href={'/spatial-map/node/' + encodeURIComponent(node.id)} class="grid text-ink font-[750] no-underline hover:text-brand-dark">
										{node.name}
										<small class="mt-[0.14rem] text-text-muted font-mono text-[0.68rem] font-normal">{node.id}</small>
									</a>
								</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">{operations.regions.find((r)=>r.id===node.region_id)?.name ?? node.region_id}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">{node.node_type}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border"><StatusPill status={node.status}/></td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">{node.latitude === null || node.longitude === null ? 'Not set' : `${node.latitude.toFixed(4)}, ${node.longitude.toFixed(4)}`}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">{node.battery_pct === null ? '—' : `${Math.round(node.battery_pct)}%`}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink">{seen(node.last_seen_at)}</td>
							</tr>
						{:else}
							<tr><td colspan="7" class="px-4 py-12 text-center text-text-muted">No nodes found.</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</section>
