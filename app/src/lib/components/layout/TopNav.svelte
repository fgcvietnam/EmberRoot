<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { operations } from '$lib/stores/operations.svelte';
	import { selectedRegionId } from '$lib/stores/regionContext';
</script>

<header class="min-h-[4.5rem] flex items-center gap-9 px-8 max-[760px]:gap-4 max-[760px]:px-4 border-b border-border bg-[rgba(16,20,24,0.92)] backdrop-blur-md sticky top-0 z-10">
	<a class="inline-flex items-center gap-[0.6rem] text-ink font-[750] tracking-[-0.03em] no-underline" href="/" aria-label="EmberRoot overview">
		<span class="grid place-items-center w-8 h-8 text-brand bg-brand/15 rounded-[0.6rem]" aria-hidden="true"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 2c3.7 4 5.5 6.8 5.5 10.1A5.5 5.5 0 1 1 6.5 12.1C6.5 8.8 8.3 6 12 2Z" stroke="currentColor" stroke-width="1.8"/><path d="M12 9c1.5 1.7 2.2 3 2.2 4.5a2.2 2.2 0 1 1-4.4 0C9.8 12 10.5 10.7 12 9Z" fill="currentColor"/></svg></span>
		<span>EmberRoot</span>
	</a>

	<div class="flex items-center gap-[0.8rem] ml-auto">
		<label>
			<span class="sr-only">Region</span>
			<select class="h-[2.25rem] max-w-[13rem] max-[760px]:max-w-[9rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink text-[0.84rem]" bind:value={$selectedRegionId} aria-label="Region filter">
				<option value="all">All regions</option>
				{#each operations.regions as region}
					<option value={region.id}>{region.name}</option>
				{/each}
			</select>
		</label>
		<span class="inline-flex items-center gap-[0.38rem] text-[0.78rem] font-[650] whitespace-nowrap max-[760px]:hidden {operations.error ? 'text-danger' : 'text-success'}"><i class="w-[0.45rem] h-[0.45rem] rounded-full bg-current"></i>{operations.error ? 'API unavailable' : 'Live'}</span>
		{#if operations.admin}
			<a class="min-h-[2.25rem] inline-flex items-center px-[0.7rem] border border-border hover:border-text-muted rounded-[0.45rem] bg-card hover:bg-surface-subtle text-ink text-[0.82rem] font-[650] no-underline cursor-pointer" href="/admin">Admin</a>
			<button class="min-h-[2.25rem] inline-flex items-center px-[0.7rem] border border-border hover:border-text-muted rounded-[0.45rem] bg-card hover:bg-surface-subtle text-ink text-[0.82rem] font-[650] no-underline cursor-pointer" type="button" onclick={() => { operations.logout(); goto('/'); }}>Sign out</button>
		{:else}
			<a class="min-h-[2.25rem] inline-flex items-center px-[0.7rem] border border-border hover:border-text-muted rounded-[0.45rem] bg-card hover:bg-surface-subtle text-ink text-[0.82rem] font-[650] no-underline cursor-pointer" href="/admin/login">Admin sign in</a>
		{/if}
	</div>
</header>
