<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';
	let selectedState = $state('all');
	let pendingId = $state<string | null>(null);
	let actionError = $state<string | null>(null);
	const alerts = $derived(($selectedRegionId === 'all' ? operations.alerts : operations.alerts.filter((alert) => alert.region_id === $selectedRegionId)).filter((alert) => selectedState === 'all' || alert.state === selectedState));
	async function acknowledge(id: string) { pendingId = id; actionError = null; try { await operations.acknowledgeAlert(id); } catch (error) { actionError = error instanceof Error ? error.message : 'Unable to acknowledge this alert.'; } finally { pendingId = null; } }
</script>

<section class="max-w-[1440px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	<header class="flex justify-between gap-6 items-end mb-7 max-sm:grid max-sm:items-start">
		<div>
			<p class="m-0 mb-1.5 text-brand text-[0.75rem] font-extrabold tracking-[0.08em] uppercase">Response queue</p>
			<h1 class="m-0 text-[2rem] tracking-[-0.04em]">Alerts</h1>
			<p class="m-0 mt-1.5 text-text-muted">Review events generated from incoming telemetry.</p>
		</div>
		<label class="grid gap-1 text-text-muted text-[0.75rem] font-[750]">
			State
			<select bind:value={selectedState}
				class="h-10 min-w-[10rem] px-2 border border-border rounded-[0.45rem] bg-card text-ink">
				<option value="all">All states</option>
				<option value="open">Open</option>
				<option value="investigating">Investigating</option>
				<option value="acknowledged">Acknowledged</option>
				<option value="resolved">Resolved</option>
			</select>
		</label>
	</header>

	{#if actionError}
		<div class="mb-4 px-4 py-3 border border-danger/40 rounded-[0.5rem] bg-danger/10 text-danger text-[0.85rem]" role="alert">{actionError}</div>
	{/if}

	{#if operations.loading}<LoadingState />{:else}
		<section class="border border-border rounded-[0.65rem] bg-card overflow-hidden">
			<div class="overflow-auto">
				<table class="w-full border-collapse text-[0.83rem]">
					<thead><tr>
						{#each ['Created','Node','Finding','Level','State','Action'] as h}
							<th class="px-[1.1rem] py-[0.72rem] bg-surface-subtle text-text-muted text-[0.68rem] tracking-[0.05em] text-left uppercase whitespace-nowrap">{h}</th>
						{/each}
					</tr></thead>
					<tbody>
						{#each alerts as alert}
							<tr>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink align-top">{new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(alert.created_at))}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border align-top">
									<a href={'/alerts/'+encodeURIComponent(alert.id)} class="grid text-ink font-[750] no-underline hover:text-brand-dark">
										{alert.node_name ?? alert.node_id}
										<small class="mt-[0.14rem] text-text-muted font-mono text-[0.68rem] font-normal">{alert.node_id}</small>
									</a>
								</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border text-ink align-top min-w-[17rem] max-w-[27rem]">{alert.explanation}</td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border align-top"><StatusPill status={alert.level}/></td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border align-top"><StatusPill status={alert.state}/></td>
								<td class="px-[1.1rem] py-[0.85rem] border-t border-border align-top">
									{#if operations.admin && (alert.state === 'open' || alert.state === 'investigating')}
										<button disabled={pendingId === alert.id} onclick={() => void acknowledge(alert.id)}
											class="px-[0.55rem] py-[0.4rem] border border-border rounded-[0.38rem] bg-brand/10 text-brand-dark text-[0.76rem] font-[750] disabled:opacity-55 disabled:cursor-wait">
											{pendingId === alert.id ? 'Saving…' : 'Acknowledge'}
										</button>
									{:else}
										<a href={'/alerts/'+encodeURIComponent(alert.id)} class="text-brand-dark text-[0.8rem] font-bold hover:text-brand-dark/80">Details</a>
									{/if}
								</td>
							</tr>
						{:else}
							<tr><td colspan="6" class="px-4 py-12 text-center text-text-muted">No alerts match this filter.</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</section>
