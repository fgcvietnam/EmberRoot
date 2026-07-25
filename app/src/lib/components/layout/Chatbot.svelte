<script lang="ts">
	import { PUBLIC_API_BASE_URL } from '$env/static/public';
	const API_BASE = PUBLIC_API_BASE_URL.replace(/\/$/u, '');

	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let open = $state(false);
	let input = $state('');
	let loading = $state(false);
	let messages = $state<Message[]>([
		{
			role: 'assistant',
			content:
				"Hi! I'm **EmberRoot AI**. Ask me about your sensor readings, active alerts, or fire risk conditions."
		}
	]);

	let messagesEl = $state<HTMLElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);

	function scrollToBottom() {
		setTimeout(() => messagesEl?.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' }), 50);
	}

	async function send() {
		const text = input.trim();
		if (!text || loading) return;
		input = '';
		messages = [...messages, { role: 'user', content: text }];
		loading = true;
		scrollToBottom();

		try {
			const res = await fetch(`${API_BASE}/api/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages })
			});
			const json = await res.json();
			let reply: string;
			if (res.status === 429) {
				const retryAfter = res.headers.get('Retry-After') ?? '60';
				reply = `⏳ Slow down! You've hit the 6 messages/min limit. Try again in **${retryAfter}s**.`;
			} else {
				reply = json?.data?.reply ?? (json?.error ? `Error: ${json.error}` : 'No response.');
			}
			messages = [...messages, { role: 'assistant', content: reply }];
		} catch (e) {
			messages = [...messages, { role: 'assistant', content: 'Network error — could not reach the API.' }];
		} finally {
			loading = false;
			scrollToBottom();
			setTimeout(() => inputEl?.focus(), 60);
		}
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	// Minimal markdown: **bold**, `code`, newlines
	function renderMarkdown(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>');
	}

	const SUGGESTIONS = [
		'What are the current fire risk levels?',
		'Show me the latest soil temperature readings',
		'Are there any active alerts?',
		'Which node has the driest conditions?'
	];
</script>

<!-- Floating trigger button -->
<button
	id="chatbot-toggle"
	class="chatbot-fab"
	class:chatbot-fab--open={open}
	onclick={() => { open = !open; if (open) setTimeout(() => inputEl?.focus(), 200); }}
	aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
	aria-expanded={open}
>
	{#if open}
		<!-- X icon -->
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
		</svg>
	{:else}
		<!-- Spark / AI icon -->
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2Z" fill="currentColor" opacity=".9"/>
		</svg>
	{/if}
</button>

<!-- Chat panel -->
{#if open}
	<div class="chatbot-panel" role="dialog" aria-label="EmberRoot AI assistant" aria-modal="false">
		<!-- Header -->
		<div class="chatbot-header">
			<div class="chatbot-header-icon">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2Z" fill="currentColor"/>
				</svg>
			</div>
			<div>
				<p class="chatbot-title">EmberRoot AI</p>
				<p class="chatbot-subtitle">Sensor & alert intelligence</p>
			</div>
			<span class="chatbot-live-dot" aria-label="Live data connected"></span>
		</div>

		<!-- Messages -->
		<div class="chatbot-messages" bind:this={messagesEl} aria-live="polite">
			{#each messages as msg, i (i)}
				<div class="chatbot-msg chatbot-msg--{msg.role}">
					{#if msg.role === 'assistant'}
						<div class="chatbot-avatar">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2Z" fill="currentColor"/>
							</svg>
						</div>
					{/if}
					<div class="chatbot-bubble">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html renderMarkdown(msg.content)}
					</div>
				</div>
			{/each}

			{#if loading}
				<div class="chatbot-msg chatbot-msg--assistant">
					<div class="chatbot-avatar">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2Z" fill="currentColor"/>
						</svg>
					</div>
					<div class="chatbot-bubble chatbot-bubble--typing">
						<span></span><span></span><span></span>
					</div>
				</div>
			{/if}

			<!-- Suggestions shown only when first message -->
			{#if messages.length === 1 && !loading}
				<div class="chatbot-suggestions">
					{#each SUGGESTIONS as s}
						<button
							class="chatbot-suggestion"
							onclick={() => { input = s; send(); }}
						>{s}</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div class="chatbot-input-row">
			<input
				id="chatbot-input"
				bind:this={inputEl}
				bind:value={input}
				onkeydown={handleKey}
				placeholder="Ask about sensor data…"
				disabled={loading}
				autocomplete="off"
				aria-label="Chat message"
			/>
			<button
				id="chatbot-send"
				onclick={send}
				disabled={loading || !input.trim()}
				aria-label="Send message"
				class="chatbot-send-btn"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	/* FAB */
	.chatbot-fab {
		position: fixed;
		bottom: 1.75rem;
		right: 1.75rem;
		z-index: 50;
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, #ff5a1f 0%, #d9420d 100%);
		color: #fff;
		display: grid;
		place-items: center;
		box-shadow: 0 4px 20px rgba(255, 90, 31, 0.45), 0 2px 8px rgba(0,0,0,0.4);
		cursor: pointer;
		transition: transform 160ms ease, box-shadow 160ms ease;
	}
	.chatbot-fab:hover {
		transform: scale(1.08);
		box-shadow: 0 6px 28px rgba(255, 90, 31, 0.6), 0 2px 8px rgba(0,0,0,0.4);
	}
	.chatbot-fab--open {
		background: #1e242b;
		box-shadow: 0 4px 16px rgba(0,0,0,0.5);
	}

	/* Panel */
	.chatbot-panel {
		position: fixed;
		bottom: 6rem;
		right: 1.75rem;
		z-index: 49;
		width: 22rem;
		max-height: 34rem;
		display: flex;
		flex-direction: column;
		background: #171c22;
		border: 1px solid #2a313b;
		border-radius: 1rem;
		box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,90,31,0.08);
		overflow: hidden;
		animation: chatbot-in 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes chatbot-in {
		from { opacity: 0; transform: translateY(12px) scale(0.97); }
		to   { opacity: 1; transform: translateY(0) scale(1); }
	}

	/* Header */
	.chatbot-header {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.9rem 1rem;
		border-bottom: 1px solid #2a313b;
		background: #1c232d;
	}
	.chatbot-header-icon {
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		background: linear-gradient(135deg, rgba(255,90,31,0.25) 0%, rgba(217,66,13,0.15) 100%);
		color: #ff5a1f;
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}
	.chatbot-title { margin: 0; font-size: 0.875rem; font-weight: 700; color: #f0f4f8; }
	.chatbot-subtitle { margin: 0; font-size: 0.72rem; color: #8b96a5; }
	.chatbot-live-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: #2ea043;
		margin-left: auto;
		flex-shrink: 0;
		box-shadow: 0 0 6px rgba(46, 160, 67, 0.7);
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.45; }
	}

	/* Messages */
	.chatbot-messages {
		flex: 1;
		overflow-y: auto;
		padding: 0.85rem 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		scrollbar-width: thin;
		scrollbar-color: #2a313b transparent;
	}
	.chatbot-msg {
		display: flex;
		align-items: flex-end;
		gap: 0.45rem;
	}
	.chatbot-msg--user { flex-direction: row-reverse; }
	.chatbot-avatar {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(255,90,31,0.2), rgba(217,66,13,0.1));
		color: #ff5a1f;
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}
	.chatbot-bubble {
		max-width: 82%;
		padding: 0.6rem 0.8rem;
		border-radius: 0.75rem;
		font-size: 0.83rem;
		line-height: 1.55;
		color: #f0f4f8;
	}
	.chatbot-msg--assistant .chatbot-bubble {
		background: #1e242b;
		border-bottom-left-radius: 0.2rem;
	}
	.chatbot-msg--user .chatbot-bubble {
		background: linear-gradient(135deg, #ff5a1f 0%, #d9420d 100%);
		color: #fff;
		border-bottom-right-radius: 0.2rem;
	}

	/* Typing indicator */
	.chatbot-bubble--typing {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0.65rem 0.9rem;
	}
	.chatbot-bubble--typing span {
		display: block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #8b96a5;
		animation: typing-dot 1.2s ease-in-out infinite;
	}
	.chatbot-bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
	.chatbot-bubble--typing span:nth-child(3) { animation-delay: 0.4s; }
	@keyframes typing-dot {
		0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
		40% { transform: scale(1); opacity: 1; }
	}

	/* Inline code */
	:global(.chatbot-bubble code) {
		font-family: 'DM Mono', monospace;
		font-size: 0.78rem;
		background: rgba(255,255,255,0.07);
		padding: 0.1em 0.35em;
		border-radius: 0.25rem;
	}

	/* Suggestions */
	.chatbot-suggestions {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.25rem;
	}
	.chatbot-suggestion {
		text-align: left;
		background: #1e242b;
		border: 1px solid #2a313b;
		border-radius: 0.5rem;
		color: #c0c9d6;
		font-size: 0.78rem;
		padding: 0.45rem 0.7rem;
		cursor: pointer;
		transition: border-color 130ms, color 130ms, background 130ms;
	}
	.chatbot-suggestion:hover {
		border-color: #ff5a1f;
		color: #ff5a1f;
		background: rgba(255,90,31,0.06);
	}

	/* Input row */
	.chatbot-input-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 0.9rem;
		border-top: 1px solid #2a313b;
		background: #1c232d;
	}
	.chatbot-input-row input {
		flex: 1;
		background: #252d37;
		border: 1px solid #2a313b;
		border-radius: 0.55rem;
		color: #f0f4f8;
		padding: 0.5rem 0.75rem;
		font-size: 0.83rem;
		outline: none;
		transition: border-color 130ms;
	}
	.chatbot-input-row input:focus { border-color: rgba(255,90,31,0.5); }
	.chatbot-input-row input::placeholder { color: #8b96a5; }
	.chatbot-input-row input:disabled { opacity: 0.5; }

	.chatbot-send-btn {
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 0.5rem;
		border: none;
		background: linear-gradient(135deg, #ff5a1f, #d9420d);
		color: #fff;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		transition: opacity 130ms, transform 130ms;
	}
	.chatbot-send-btn:disabled { opacity: 0.4; }
	.chatbot-send-btn:not(:disabled):hover { transform: scale(1.08); }

	/* Mobile: full-width panel at bottom */
	@media (max-width: 480px) {
		.chatbot-panel {
			right: 0;
			left: 0;
			bottom: 5rem;
			width: 100%;
			border-radius: 1rem 1rem 0 0;
			max-height: 60vh;
		}
		.chatbot-fab { right: 1rem; bottom: 1rem; }
	}
</style>
