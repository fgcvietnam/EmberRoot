<!-- ────────────────────────────────────────────────────────────────
  Button.svelte — EmberRoot Design System
  Variants: primary | secondary | danger | ghost
  Sizes:     sm | md | lg
──────────────────────────────────────────────────────────────── -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const sizeStyles: Record<string, string> = {
		sm: 'h-[28px] px-[10px] text-[11px]',
		md: 'h-[36px] px-[14px] text-[13px]',
		lg: 'h-[44px] px-[20px] text-[14px]'
	};
	const variantStyles: Record<string, string> = {
		primary: 'bg-ember-500 text-card border-ember-400 [box-shadow:var(--glow-ember)] hover:enabled:bg-ember-400 hover:enabled:[box-shadow:0_0_28px_-4px_rgba(240,120,64,0.5)]',
		secondary: 'bg-surface-raised text-text-primary border-surface-border hover:enabled:bg-surface-overlay hover:enabled:border-surface-muted',
		danger: 'bg-status-critical text-card border-[#f06868] [box-shadow:0_0_16px_-4px_rgba(240,80,80,0.35)] hover:enabled:bg-[#f36868] hover:enabled:[box-shadow:0_0_24px_-4px_rgba(240,80,80,0.55)]',
		ghost: 'bg-transparent text-text-secondary border-transparent hover:enabled:bg-surface-raised hover:enabled:text-text-primary'
	};
</script>

<button
	class="inline-flex items-center justify-center gap-[6px] font-medium tracking-[0.01em] border border-transparent rounded-[6px] cursor-pointer transition-colors transition-shadow duration-150 whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-ember-400 focus-visible:outline-offset-2 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none {sizeStyles[size]} {variantStyles[variant]} {className}"
	{...restProps}
>
	{@render children?.()}
</button>
