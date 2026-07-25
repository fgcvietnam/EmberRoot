<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	interface Props { title: string; description: string; primaryHref: string; primaryLabel: string; }
	let { title, description, primaryHref, primaryLabel }: Props = $props();
</script>
<section class="max-w-[900px] mx-auto py-12 px-[2.75rem] max-[680px]:py-8 max-[680px]:px-4">
	<p class="m-0 mb-[0.45rem] text-brand text-xs font-extrabold tracking-[0.08em] uppercase">Operations</p>
	<h1 class="m-0 text-3xl tracking-[-0.04em]">{title}</h1>
	<p class="m-0 max-w-[40rem] mt-[0.6rem] text-text-muted">{description}</p>
	<div class="grid grid-cols-3 max-[680px]:grid-cols-1 gap-[0.8rem] my-8">
		<article class="p-[1.1rem] border border-border rounded-[0.65rem] bg-card">
			<span class="text-text-muted text-[0.78rem] font-bold">Registered nodes</span>
			<strong class="block mt-[0.4rem] font-mono text-[1.55rem]">{operations.nodes.length}</strong>
		</article>
		<article class="p-[1.1rem] border border-border rounded-[0.65rem] bg-card">
			<span class="text-text-muted text-[0.78rem] font-bold">Open alerts</span>
			<strong class="block mt-[0.4rem] font-mono text-[1.55rem]">{operations.alerts.filter((alert)=>alert.state==='open'||alert.state==='investigating').length}</strong>
		</article>
		<article class="p-[1.1rem] border border-border rounded-[0.65rem] bg-card">
			<span class="text-text-muted text-[0.78rem] font-bold">Regions</span>
			<strong class="block mt-[0.4rem] font-mono text-[1.55rem]">{operations.regions.length}</strong>
		</article>
	</div>
	<a class="inline-flex px-[0.8rem] py-[0.65rem] rounded-[0.45rem] bg-brand text-card text-[0.84rem] font-[750] no-underline" href={primaryHref}>{primaryLabel} →</a>
</section>
