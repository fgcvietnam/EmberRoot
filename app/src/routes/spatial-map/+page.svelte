<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';
	const regions = $derived($selectedRegionId === 'all' ? operations.regions : operations.regions.filter((region) => region.id === $selectedRegionId));
	const nodes = $derived($selectedRegionId === 'all' ? operations.nodes : operations.nodes.filter((node) => node.region_id === $selectedRegionId));
</script>

<section class="max-w-[1240px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	<header class="flex justify-between gap-4 items-end mb-7 max-sm:grid max-sm:items-start">
		<div>
			<p class="m-0 mb-1.5 text-brand text-[0.75rem] font-extrabold tracking-[0.08em] uppercase">Coverage</p>
			<h1 class="m-0 text-[2rem] tracking-[-0.04em]">Monitoring footprint</h1>
			<p class="m-0 mt-1.5 text-text-muted">Coordinates registered for regions and field nodes.</p>
		</div>
		<span class="text-text-muted font-mono text-[0.75rem]">{nodes.filter((node)=>node.latitude !== null && node.longitude !== null).length} mapped nodes</span>
	</header>

	{#if operations.loading}<LoadingState />{:else}
		<div class="grid grid-cols-[minmax(15rem,0.7fr)_1.3fr] gap-4 max-sm:grid-cols-1">
			<section class="overflow-hidden border border-border rounded-[0.65rem] bg-card">
				<h2 class="m-0 px-[1.15rem] py-4 border-b border-border text-[0.95rem]">Region centers</h2>
				{#each regions as region}
					<article class="flex justify-between gap-4 px-[1.15rem] py-4 border-t border-border first:border-t-0">
						<div>
							<strong class="text-[0.86rem]">{region.name}</strong>
							<p class="m-0 mt-0.5 text-text-muted text-[0.77rem]">{region.description ?? region.code}</p>
						</div>
						<code class="self-center text-text-muted font-mono text-[0.67rem] text-right">{region.center_lat.toFixed(4)}, {region.center_lon.toFixed(4)}</code>
					</article>
				{:else}
					<p class="px-[1.15rem] py-8 text-text-muted text-center">No region is selected.</p>
				{/each}
			</section>

			<section class="overflow-hidden border border-border rounded-[0.65rem] bg-card">
				<div class="flex justify-between gap-4 px-[1.15rem] py-4 border-b border-border">
					<h2 class="m-0 text-[0.95rem]">Node coordinates</h2>
					<span class="text-text-muted text-[0.75rem]">Use this inventory to position field hardware.</span>
				</div>
				<div class="grid">
					{#each nodes as node}
						<a href={'/spatial-map/node/'+encodeURIComponent(node.id)}
							class="flex justify-between gap-4 px-[1.15rem] py-4 border-t border-border first:border-t-0 text-ink no-underline hover:bg-surface-subtle">
							<div class="grid gap-0.5">
								<strong class="text-[0.86rem]">{node.name}</strong>
								<small class="text-text-muted font-mono text-[0.7rem]">{node.id} · {node.latitude === null || node.longitude === null ? 'Coordinates not set' : `${node.latitude.toFixed(5)}, ${node.longitude.toFixed(5)}`}</small>
							</div>
							<StatusPill status={node.status}/>
						</a>
					{:else}
						<p class="px-[1.15rem] py-8 text-text-muted text-center">No nodes are registered.</p>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</section>
