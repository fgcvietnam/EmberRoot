<script lang="ts">
	interface Props { label?: string; }
	let { label = 'Loading operational data…' }: Props = $props();
</script>
<div class="min-h-[14rem] grid place-content-center gap-[0.8rem] text-text-muted text-[0.9rem]" role="status"><span class="w-[1.4rem] h-[1.4rem] border-2 border-[#dce4e8] border-t-brand rounded-full mx-auto animate-spin motion-reduce:animate-none"></span>{label}</div>
