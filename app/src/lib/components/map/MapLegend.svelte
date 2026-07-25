<script lang="ts">
	type LegendItem = {
		label: string;
		color: string;
	};

	let {
		items = []
	}: {
		items?: LegendItem[];
	} = $props();
</script>

<div class="bg-[#0f172a]/90 border border-[#94a3b8]/15 rounded-[18px] p-3.5 text-[#e2e8f0] text-xs">
	<div class="font-bold mb-2.5">Legend</div>
	{#each items as item}
		<div class="flex items-center gap-2.5 mb-2 last:mb-0">
			<span class="w-3 h-3 rounded-full shrink-0" style="background:{item.color}"></span>
			<span>{item.label}</span>
		</div>
	{/each}
</div>