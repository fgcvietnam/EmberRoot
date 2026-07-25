<script lang="ts">
	type SearchResult = {
		id: string;
		title: string;
		details: string;
		coords: [number, number];
	};

	let {
		results = [],
		onSearch,
		onSelect
	}: {
		results?: SearchResult[];
		onSearch?: (query: string) => void;
		onSelect?: (item: SearchResult) => void;
	} = $props();

	let query = $state('');

	function runSearch() {
		onSearch?.(query);
	}

	function selectItem(item: SearchResult) {
		onSelect?.(item);
	}
</script>

<div class="bg-[#0f172a]/90 border border-[#94a3b8]/14 rounded-[18px] p-3.5 text-[#e2e8f0]">
	<div class="flex gap-2.5 mb-3">
		<input
			type="search"
			placeholder="Search node ID, region, coordinates..."
			bind:value={query}
			onkeydown={(event) => event.key === 'Enter' && runSearch()}
			class="flex-1 px-3 py-2 rounded-[14px] border border-[#94a3b8]/18 bg-white/[0.04] text-[#e2e8f0] outline-none"
		/>
		<button type="button" class="border-0 px-3.5 py-2 rounded-[14px] bg-[#7c3aed] text-white font-bold cursor-pointer" onclick={runSearch}>
			Search
		</button>
	</div>

	<ul class="list-none p-0 m-0 grid gap-2">
		{#each results as item}
			<li>
				<button type="button" class="w-full text-left px-3 py-2.5 rounded-[14px] bg-white/[0.05] cursor-pointer hover:bg-white/10" onclick={() => selectItem(item)}>
					<div class="font-bold">{item.title}</div>
					<div class="text-xs text-[#e2e8f0]/72">{item.details}</div>
				</button>
			</li>
		{/each}
	</ul>
</div>