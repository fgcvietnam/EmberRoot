<!-- FilterBar.svelte
  Status filter chips for the spatial map.
  Emits the selected status string (or null for "All") via onFilter.
-->
<script lang="ts">
	type Status = 'online' | 'warning' | 'critical' | 'offline';

	interface FilterOption {
		id: Status | null;
		label: string;
		color: string;
	}

	let {
		onFilter
	}: {
		onFilter: (status: Status | null) => void;
	} = $props();

	const FILTERS: FilterOption[] = [
		{ id: null,       label: 'All',      color: 'var(--text-secondary)' },
		{ id: 'online',   label: 'Online',   color: '#22c55e' },
		{ id: 'warning',  label: 'Warning',  color: '#f59e0b' },
		{ id: 'critical', label: 'Critical', color: '#ef4444' },
		{ id: 'offline',  label: 'Offline',  color: '#6b7280' }
	];

	let active = $state<Status | null>(null);

	function select(id: Status | null) {
		active = id;
		onFilter(id);
	}
</script>

<div class="flex gap-[6px] flex-wrap bg-[#0f172a]/82 border border-white/10 rounded-[14px] px-[10px] py-2 backdrop-blur-[8px]" role="group" aria-label="Filter nodes by status">
	{#each FILTERS as f}
		<button
			class="inline-flex items-center gap-[5px] px-[12px] py-[5px] rounded-lg border bg-transparent text-[11px] font-semibold tracking-[0.04em] cursor-pointer transition-[background-color,color,border-color] duration-150 ease-in-out hover:bg-white/[0.06] hover:text-text-secondary {active === f.id ? '' : 'border-transparent text-text-muted'}"
			onclick={() => select(f.id)}
			style="--chip-color:{f.color}; {active === f.id ? 'background: color-mix(in srgb, var(--chip-color) 15%, transparent); border-color: color-mix(in srgb, var(--chip-color) 40%, transparent); color: var(--chip-color);' : ''}"
			aria-pressed={active === f.id}
		>
			{#if f.id !== null}
				<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: {f.color}"></span>
			{/if}
			{f.label}
		</button>
	{/each}
</div>
