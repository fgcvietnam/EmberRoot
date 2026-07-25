<script lang="ts">
	import { page } from '$app/state';
	import { operations } from '$lib/stores/operations.svelte';
	import StatusPill from '$lib/components/feedback/StatusPill.svelte';
	import LoadingState from '$lib/components/feedback/LoadingState.svelte';
	const id = $derived(page.params.id);
	const alert = $derived(operations.alerts.find((item) => item.id === id));
	const node = $derived(alert ? operations.nodes.find((item) => item.id === alert.node_id) : undefined);
	let saving = $state(false); let error = $state<string | null>(null);
	async function acknowledge() { if (!alert) return; saving=true; error=null; try { await operations.acknowledgeAlert(alert.id); } catch (e) { error=e instanceof Error?e.message:'Unable to acknowledge alert.'; } finally { saving=false; } }
</script>

<section class="max-w-[1100px] mx-auto px-11 py-10 pb-16 max-sm:px-4 max-sm:py-6 max-sm:pb-12">
	{#if operations.loading}<LoadingState />
	{:else if !alert}
		<div class="py-16 px-4 text-center">
			<h1 class="m-0 mb-2 text-[2rem] tracking-[-0.04em]">Alert not found</h1>
			<p class="m-0 mb-4 text-text-muted">This alert may no longer be available.</p>
			<a href="/alert-history" class="text-brand-dark font-[750] no-underline hover:underline">Return to alerts</a>
		</div>
	{:else}
		<a class="text-brand-dark text-[0.82rem] font-[750] no-underline hover:underline" href="/alert-history">← Alerts</a>
		<header class="flex justify-between gap-4 my-6 max-sm:grid">
			<div>
				<p class="m-0 mb-1.5 text-brand font-mono text-[0.72rem]">Alert {alert.id}</p>
				<h1 class="m-0 text-[2rem] tracking-[-0.04em]">{alert.node_name ?? alert.node_id}</h1>
				<p class="m-0 mt-1.5 text-text-muted">{new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'medium'}).format(new Date(alert.created_at))}</p>
			</div>
			<div class="flex gap-[0.45rem] items-start max-sm:order-first"><StatusPill status={alert.level}/><StatusPill status={alert.state}/></div>
		</header>

		{#if error}
			<div class="mb-4 p-3 border border-danger/40 rounded-[0.5rem] bg-danger/10 text-danger text-[0.85rem]">{error}</div>
		{/if}

		<div class="grid grid-cols-[1fr_17rem] gap-4 max-sm:grid-cols-1">
			<section class="p-5 border border-border rounded-[0.65rem] bg-card">
				<h2 class="m-0 mb-4 text-[0.95rem]">Finding</h2>
				<p class="my-4 text-base leading-[1.65]">{alert.explanation}</p>
				<dl class="grid gap-3 m-0">
					{#each [
						{label:'Node', value:node?.name ?? alert.node_id, link:'/spatial-map/node/'+encodeURIComponent(alert.node_id)},
						{label:'Region', value:operations.regions.find((r)=>r.id===alert.region_id)?.name ?? alert.region_id ?? '—'},
						{label:'Acknowledged', value:alert.acknowledged_at ? new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(alert.acknowledged_at)) : 'Not yet'},
						{label:'Actor', value:alert.acknowledged_by ?? '—'},
					] as entry}
						<div class="flex justify-between gap-4 pt-3 border-t border-border">
							<dt class="text-text-muted text-[0.8rem]">{entry.label}</dt>
							<dd class="m-0 text-ink text-[0.84rem] font-[650] text-right">
								{#if entry.link}<a href={entry.link} class="text-brand-dark">{entry.value}</a>{:else}{entry.value}{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</section>

			<aside class="p-5 border border-border rounded-[0.65rem] bg-card">
				<h2 class="m-0 mb-4 text-[0.95rem]">Response</h2>
				{#if operations.admin && (alert.state==='open'||alert.state==='investigating')}
					<p class="mt-2.5 mb-4 text-text-muted text-[0.84rem]">Acknowledge this alert to record the active response.</p>
					<button disabled={saving} onclick={() => void acknowledge()}
						class="inline-flex px-3 py-[0.65rem] border border-brand rounded-[0.45rem] bg-brand text-card text-[0.8rem] font-[750] disabled:opacity-60 cursor-pointer">
						{saving?'Saving…':'Acknowledge alert'}
					</button>
				{:else if !operations.admin}
					<p class="mt-2.5 mb-4 text-text-muted text-[0.84rem]">Admin sign-in is required to acknowledge an alert.</p>
					<a href="/admin/login" class="inline-flex px-3 py-[0.65rem] border border-brand rounded-[0.45rem] bg-brand text-card text-[0.8rem] font-[750] no-underline">Sign in as admin</a>
				{:else}
					<p class="mt-2.5 text-text-muted text-[0.84rem]">This alert is already {alert.state.replace('_',' ')}.</p>
				{/if}
			</aside>
		</div>
	{/if}
</section>
