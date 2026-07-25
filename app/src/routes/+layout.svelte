<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TopNav from '$lib/components/layout/TopNav.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Chatbot from '$lib/components/layout/Chatbot.svelte';
	import { operations } from '$lib/stores/operations.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(false);
	onMount(() => { operations.start(); return () => operations.stop(); });
</script>

<svelte:head><link rel="icon" href={favicon} /><title>EmberRoot Operations</title><meta name="description" content="EmberRoot wildfire monitoring operations" /></svelte:head>
<a class="skip-link" href="#main-content">Skip to content</a>
<TopNav />
<Sidebar collapsed={sidebarCollapsed} onToggle={() => (sidebarCollapsed = !sidebarCollapsed)} />
<main id="main-content" class:collapsed={sidebarCollapsed}>{@render children()}</main>
<Chatbot />
