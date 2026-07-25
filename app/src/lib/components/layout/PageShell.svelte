<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		breadcrumb?: string[];
	}
	let { title, subtitle, breadcrumb }: Props = $props();
</script>

<div class="flex flex-col min-h-full px-8 py-7 gap-6">
	<!-- Page header -->
	<div class="flex flex-col gap-2 pb-5 border-b border-surface-border">
		{#if breadcrumb && breadcrumb.length > 0}
			<nav class="flex items-center gap-[6px] text-xs" aria-label="Breadcrumb">
				{#each breadcrumb as crumb, i}
					<span class="text-text-muted font-medium last:text-text-secondary">{crumb}</span>
					{#if i < breadcrumb.length - 1}
						<span class="text-text-muted/50" aria-hidden="true">/</span>
					{/if}
				{/each}
			</nav>
		{/if}

		<div class="flex items-baseline gap-4 flex-wrap">
			<h1 class="text-[22px] font-bold tracking-[-0.4px] text-text-primary leading-[1.2]">{title}</h1>
			{#if subtitle}
				<p class="text-[13px] text-text-muted font-normal">{subtitle}</p>
			{/if}
		</div>
	</div>

	<!-- Page body slot -->
	<div class="flex-1">
		<slot />
	</div>
</div>
