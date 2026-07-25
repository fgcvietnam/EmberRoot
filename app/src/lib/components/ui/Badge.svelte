<!-- ────────────────────────────────────────────────────────────────
  Badge.svelte — EmberRoot Design System
  Variants: neutral | online | warning | critical | ember
  Sizes:    sm | md
──────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: 'neutral' | 'online' | 'warning' | 'critical' | 'ember';
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'neutral',
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const sizeStyles: Record<string, string> = {
		sm: 'text-[9px] px-[7px] py-[2px]',
		md: 'text-[10px] px-[9px] py-[3px]'
	};
	const variantStyles: Record<string, string> = {
		neutral: 'bg-surface-overlay text-text-secondary border-surface-muted',
		online: 'bg-[rgba(34,211,160,0.12)] text-status-online border-[rgba(34,211,160,0.3)]',
		warning: 'bg-[rgba(240,179,64,0.12)] text-status-warning border-[rgba(240,179,64,0.3)]',
		critical: 'bg-[rgba(240,80,80,0.12)] text-status-critical border-[rgba(240,80,80,0.3)]',
		ember: 'bg-[rgba(240,120,64,0.15)] text-ember-300 border-ember-500'
	};
</script>

<span class="inline-flex items-center gap-1 font-semibold tracking-[0.06em] uppercase rounded-full border leading-none whitespace-nowrap {sizeStyles[size]} {variantStyles[variant]} {className}" {...restProps}>
	{@render children?.()}
</span>
