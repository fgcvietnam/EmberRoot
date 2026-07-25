<script lang="ts">
	import { operations } from '$lib/stores/operations.svelte';
	let id=$state(''); let name=$state(''); let regionId=$state(''); let nodeType=$state<'full'|'light'|'fence'>('full'); let latitude=$state(''); let longitude=$state(''); let error=$state<string|null>(null); let saving=$state(false);
	$effect(()=>{if(!regionId&&operations.regions[0])regionId=operations.regions[0].id;});
	async function create(){saving=true;error=null;try{await operations.createNode({id:id.trim(),name:name.trim(),regionId,nodeType,latitude:latitude===''?undefined:Number(latitude),longitude:longitude===''?undefined:Number(longitude)});id='';name='';latitude='';longitude='';}catch(e){error=e instanceof Error?e.message:'Unable to create node.';}finally{saving=false;}}
</script>

{#if !operations.admin}
	<section class="max-w-[820px] mx-auto px-11 pt-20 pb-16 text-center max-sm:px-4">
		<h1 class="m-0 mb-2 text-[2rem] tracking-[-0.04em]">Administrator access required</h1>
		<p class="m-0 mb-4 text-text-muted">Sign in to register monitoring hardware.</p>
		<a href="/admin/login" class="inline-flex px-3 py-[0.65rem] border border-brand rounded-[0.45rem] bg-brand text-card text-[0.82rem] font-[750] no-underline">Sign in</a>
	</section>
{:else}
	<section class="max-w-[820px] mx-auto px-11 py-12 pb-16 max-sm:px-4 max-sm:py-8">
		<p class="m-0 mb-1.5 text-brand text-[0.75rem] font-extrabold tracking-[0.08em] uppercase">Administration</p>
		<h1 class="m-0 text-[2rem] tracking-[-0.04em]">Register a field node</h1>
		<p class="m-0 mt-2 text-text-muted">Creates a node record. It will remain offline until the first telemetry payload is received.</p>

		<form onsubmit={(e)=>{e.preventDefault();void create();}}
			class="mt-8 p-5 border border-border rounded-[0.7rem] bg-card">
			<div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
				{#each [
					{label:'Node ID', bind:'id', placeholder:'e.g. SN-0101', value:id, set:(v:string)=>{id=v;}},
					{label:'Display name', bind:'name', placeholder:'e.g. Canal East 01', value:name, set:(v:string)=>{name=v;}},
				] as field}
					<label class="grid gap-1.5 text-ink text-[0.8rem] font-bold">
						{field.label}
						<input value={field.value} oninput={(e)=>field.set((e.target as HTMLInputElement).value)} required placeholder={field.placeholder}
							class="h-[2.6rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink" />
					</label>
				{/each}
				<label class="grid gap-1.5 text-ink text-[0.8rem] font-bold">
					Region
					<select bind:value={regionId} class="h-[2.6rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink">
						{#each operations.regions as region}<option value={region.id}>{region.name}</option>{/each}
					</select>
				</label>
				<label class="grid gap-1.5 text-ink text-[0.8rem] font-bold">
					Hardware type
					<select bind:value={nodeType} class="h-[2.6rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink">
						<option value="full">Full</option>
						<option value="light">Light</option>
						<option value="fence">Fence</option>
					</select>
				</label>
				<label class="grid gap-1.5 text-ink text-[0.8rem] font-bold">
					Latitude <span class="text-text-muted font-medium">optional</span>
					<input bind:value={latitude} inputmode="decimal" class="h-[2.6rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink" />
				</label>
				<label class="grid gap-1.5 text-ink text-[0.8rem] font-bold">
					Longitude <span class="text-text-muted font-medium">optional</span>
					<input bind:value={longitude} inputmode="decimal" class="h-[2.6rem] px-[0.65rem] border border-border rounded-[0.45rem] bg-card text-ink" />
				</label>
			</div>

			{#if error}<p class="mt-4 text-danger text-[0.84rem]" role="alert">{error}</p>{/if}

			<button disabled={saving}
				class="inline-flex mt-5 px-3 py-[0.65rem] border border-brand rounded-[0.45rem] bg-brand text-card text-[0.82rem] font-[750] disabled:opacity-60 disabled:cursor-wait cursor-pointer">
				{saving?'Registering…':'Register node'}
			</button>
		</form>
	</section>
{/if}
