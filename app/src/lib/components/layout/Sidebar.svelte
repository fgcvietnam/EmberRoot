<script lang="ts">
	import { page } from '$app/state';
	interface Props { collapsed: boolean; onToggle: () => void; }
	let { collapsed, onToggle }: Props = $props();
	const items = [
		{ href: '/', label: 'Overview', icon: 'M3 12l9-8 9 8v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8Z' },
		{ href: '/live-monitoring', label: 'Live data', icon: 'M4 19V9m5 10V5m5 14v-7m5 7V3' },
		{ href: '/sensor-network', label: 'Nodes', icon: 'M5 4h14v16H5zM9 8h6m-6 4h6m-6 4h3' },
		{ href: '/alert-history', label: 'Alerts', icon: 'M12 4a7 7 0 0 0-7 7c0 7-3 7-3 9h20c0-2-3-2-3-9a7 7 0 0 0-7-7Zm-2 18h4' },
		{ href: '/spatial-map', label: 'Coverage', icon: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z' }
	];
</script>

<aside class="fixed top-[4.5rem] bottom-0 p-[1.15rem_0.75rem] border-r border-border bg-page transition-[width] duration-[180ms] ease-in-out z-5 max-[760px]:hidden {collapsed ? 'w-[4.5rem]' : 'w-[13.75rem]'}">
	<button class="absolute top-4 right-[0.55rem] w-6 h-6 border-0 rounded-[0.35rem] bg-transparent text-text-muted text-[1.35rem] cursor-pointer leading-none transition-transform duration-[180ms] {collapsed ? 'rotate-180' : ''}" type="button" onclick={onToggle} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>‹</button>
	<nav class="grid gap-1 mt-8" aria-label="Operations">
		{#each items as item}
			<a href={item.href} class="flex items-center gap-[0.7rem] min-h-[2.75rem] px-[0.72rem] rounded-lg text-[0.88rem] font-semibold no-underline transition-colors {page.url.pathname === item.href ? 'text-brand bg-brand/10' : 'text-text-muted hover:bg-surface-subtle hover:text-ink'}" title={collapsed ? item.label : undefined}>
				<svg class="w-[1.1rem] h-[1.1rem] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={item.icon} stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
				{#if !collapsed}<span>{item.label}</span>{/if}
			</a>
		{/each}
	</nav>
</aside>
