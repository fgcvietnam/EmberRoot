<script lang="ts">
	import { goto } from '$app/navigation';
	import { operations } from '$lib/stores/operations.svelte';
	let username = $state(''); let password = $state(''); let error = $state<string | null>(null); let submitting = $state(false);
	async function login() { submitting=true; error=null; try { await operations.login(username,password); goto('/'); } catch (e) { error=e instanceof Error?e.message:'Unable to sign in.'; } finally { submitting=false; } }
</script>

<section class="min-h-[calc(100dvh-4.5rem)] grid place-items-center p-8">
	<form onsubmit={(event)=>{event.preventDefault();void login();}}
		class="w-[min(100%,26rem)] p-8 border border-border rounded-[0.75rem] bg-card shadow-[0_12px_30px_rgba(22,35,44,0.06)]">
		<a href="/" class="text-brand-dark font-extrabold no-underline">EmberRoot</a>
		<p class="m-0 mt-6 mb-1.5 text-brand text-[0.74rem] font-extrabold tracking-[0.08em] uppercase">Administrator access</p>
		<h1 class="m-0 text-[1.8rem] tracking-[-0.04em]">Sign in to respond</h1>

		<label class="grid gap-1.5 mt-4 text-ink text-[0.8rem] font-bold">
			Username
			<input bind:value={username} autocomplete="username" required
				class="h-[2.7rem] px-3 border border-border rounded-[0.45rem] bg-card text-ink" />
		</label>
		<label class="grid gap-1.5 mt-4 text-ink text-[0.8rem] font-bold">
			Password
			<input bind:value={password} type="password" autocomplete="current-password" required
				class="h-[2.7rem] px-3 border border-border rounded-[0.45rem] bg-card text-ink" />
		</label>

		{#if error}<p class="mt-4 text-danger text-[0.83rem]" role="alert">{error}</p>{/if}

		<button disabled={submitting}
			class="w-full h-[2.7rem] mt-5 border border-brand rounded-[0.45rem] bg-brand text-card font-[750] disabled:opacity-60 disabled:cursor-wait cursor-pointer">
			{submitting?'Signing in…':'Sign in'}
		</button>
	</form>
</section>
