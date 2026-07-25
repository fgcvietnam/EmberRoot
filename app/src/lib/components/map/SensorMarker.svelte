<script lang="ts">
	import type { SensorNode } from '$lib/mock';

	let { sensor, selected = false }: { sensor: SensorNode; selected?: boolean } = $props();

	const statusDotColor = $derived(({
		online: 'bg-[#22c55e]',
		warning: 'bg-[#f59e0b]',
		critical: 'bg-[#ef4444]',
		offline: 'bg-[#374151]'
	} as Record<string, string>)[sensor.status] ?? 'bg-[#374151]');
</script>

<div class="flex items-center gap-2 px-2 py-1 rounded-full text-white text-[11px] font-bold shadow-[0_0_0_2px_rgba(15,23,42,0.32)] {selected ? 'bg-[#22c55e]/95' : 'bg-[#0f172a]/90'}">
	<div class="w-2.5 h-2.5 rounded-full {statusDotColor}"></div>
	<div>{sensor.id.replace('SN-', '')}</div>
</div>