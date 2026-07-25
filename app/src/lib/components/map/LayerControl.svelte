<script lang="ts">
	type Layer = {
		id: string;
		label: string;
		enabled: boolean;
	};

	let {
		layers = [],
		onToggle
	}: {
		layers?: Layer[];
		onToggle: (id: string) => void;
	} = $props();
</script>

<div class="bg-[#0f172a]/96 border border-[#94a3b8]/14 rounded-[18px] p-3.5 text-[#e2e8f0] text-[13px]">
	<div class="font-bold mb-2.5">Map layers</div>
	{#each layers as layer}
		<label class="flex items-center gap-2.5 mb-2 last:mb-0 cursor-pointer">
			<input type="checkbox" checked={layer.enabled} onchange={() => onToggle(layer.id)} />
			<span>{layer.label}</span>
		</label>
	{/each}
</div>