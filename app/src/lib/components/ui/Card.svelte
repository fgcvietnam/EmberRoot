<!-- ────────────────────────────────────────────────────────────────
  Card.svelte — EmberRoot Design System
  Variants: default | glass | raised
  Padding:  none | sm | md | lg
──────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'default' | 'glass' | 'raised';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		padding = 'md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const paddingStyles: Record<string, string> = {
		none: 'p-0',
		sm: 'p-[12px]',
		md: 'p-[20px]',
		lg: 'p-[32px]'
	};
	const variantStyles: Record<string, string> = {
		default: "bg-surface-base [box-shadow:0_1px_3px_rgba(0,0,0,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-surface-muted before:to-transparent",
		raised: 'bg-surface-raised [box-shadow:0_4px_16px_rgba(0,0,0,0.35)]',
		glass: 'bg-[rgba(22,28,34,0.72)] backdrop-blur-[14px] backdrop-saturate-[1.6] border-[rgba(255,255,255,0.07)]'
	};
</script>

<div class="rounded-[8px] border border-surface-border relative overflow-hidden {variantStyles[variant]} {paddingStyles[padding]} {className}" {...restProps}>
	{@render children?.()}
</div>
