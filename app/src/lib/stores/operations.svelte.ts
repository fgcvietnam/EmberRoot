import { api, type ApiAlert, type ApiNode, type ApiRegion, type AuthSession, type RealtimeEvent } from '$lib/api';

class OperationsStore {
	regions = $state<ApiRegion[]>([]);
	nodes = $state<ApiNode[]>([]);
	alerts = $state<ApiAlert[]>([]);
	loading = $state(true);
	error = $state<string | null>(null);
	lastUpdated = $state<Date | null>(null);
	latestEvent = $state<RealtimeEvent | null>(null);
	admin = $state<AuthSession['user'] | null>(api.hasSession() ? { username: 'admin', role: 'admin' } : null);
	private disconnect: (() => void) | null = null;
	private pollTimer: ReturnType<typeof setInterval> | null = null;

	async refresh(): Promise<void> {
		try {
			const [regions, nodes, alerts] = await Promise.all([
				api.getRegions(), api.getNodes(), api.getAlerts()
			]);
			this.regions = regions;
			this.nodes = nodes;
			this.alerts = alerts;
			this.error = null;
			this.lastUpdated = new Date();
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Unable to load operational data.';
		} finally {
			this.loading = false;
		}
	}

	start(): void {
		void this.refresh();
		this.connectRealtime();
		// Poll every 10 s as a fallback for when WebSocket is unavailable (no admin token).
		if (!this.pollTimer) {
			this.pollTimer = setInterval(() => { void this.refresh(); }, 10_000);
		}
	}

	private connectRealtime(): void {
		this.disconnect?.();
		this.disconnect = api.connectRealtime((event) => {
			this.latestEvent = event;
			void this.refresh();
		});
	}

	async login(username: string, password: string): Promise<void> {
		const session = await api.login(username, password);
		this.admin = session.user;
		this.connectRealtime();
	}

	logout(): void {
		api.logout();
		this.admin = null;
		this.disconnect?.();
		this.disconnect = null;
	}

	async acknowledgeAlert(id: string): Promise<void> {
		await api.acknowledgeAlert(id);
		await this.refresh();
	}

	async createNode(input: Parameters<typeof api.createNode>[0]): Promise<void> {
		await api.createNode(input);
		await this.refresh();
	}

	stop(): void {
		this.disconnect?.();
		this.disconnect = null;
		if (this.pollTimer) {
			clearInterval(this.pollTimer);
			this.pollTimer = null;
		}
	}
}

export const operations = new OperationsStore();
