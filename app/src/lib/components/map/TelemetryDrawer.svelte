<script lang="ts">
	import type {
		SensorNode,
		Telemetry,
		NodeHealth,
		ConfidenceScore
	} from '$lib/mock';

	let {
		sensor = null,
		telemetry = null,
		health = null,
		confidence = null
	}: {
		sensor?: SensorNode | null;
		telemetry?: Telemetry | null;
		health?: NodeHealth | null;
		confidence?: ConfidenceScore | null;
	} = $props();

	function statusTone(status: string) {
		const tones = {
			online: { label: 'Operational', color: '#22c55e' },
			warning: { label: 'Attention', color: '#f59e0b' },
			critical: { label: 'Critical', color: '#ef4444' },
			offline: { label: 'Offline', color: '#6b7280' }
		};
		return tones[status as keyof typeof tones] ?? tones.offline;
	}

	function healthTone(value: number) {
		if (value >= 80) return { label: 'Healthy', color: '#22c55e' };
		if (value >= 55) return { label: 'Stable', color: '#f59e0b' };
		return { label: 'Needs review', color: '#ef4444' };
	}

	const statusInfo = $derived(sensor ? statusTone(sensor.status) : null);
	const batteryHealth = $derived(telemetry ? healthTone(telemetry.batteryPct) : null);
</script>

<div class="flex flex-col gap-4">
	{#if sensor && telemetry}
		<div class="flex justify-between items-center gap-3.5">
			<div>
				<div class="text-lg font-bold">{sensor.name}</div>
				<div class="text-[13px] text-text-muted">{sensor.id} • {sensor.regionId}</div>
			</div>
			<div class="text-right" style="color:{statusInfo?.color}">{confidence?.score ?? 0}<span class="block text-[11px] text-text-muted">Confidence</span></div>
		</div>

		{#if confidence?.explanation?.length}
			<div class="bg-surface-base border border-surface-border rounded-2xl p-4">
				<div class="font-bold mb-2.5">Explainable alert rationale</div>
				<ul class="list-none p-0 m-0 grid gap-2">
					{#each confidence.explanation as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if confidence?.factors}
			<div class="bg-surface-base border border-surface-border rounded-2xl p-4">
				<div class="font-bold mb-2.5">Signal factors</div>
				<div class="grid grid-cols-2 gap-2">
					{#each Object.entries(confidence.factors) as [key, value]}
						<div class="flex justify-between items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-raised border border-surface-border text-xs">
							<span>{key}</span>
							<strong>{value}</strong>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-wrap gap-2">
			<span class="inline-flex items-center border border-current rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] uppercase" style="color:{statusInfo?.color}; background:{statusInfo?.color}1a; border-color:{statusInfo?.color}44;">{statusInfo?.label}</span>
			{#if health}
				<span class="inline-flex items-center border border-current rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] uppercase" style="color:{batteryHealth?.color}; background:{batteryHealth?.color}1a; border-color:{batteryHealth?.color}44;">{batteryHealth?.label}</span>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Last update</div>
				<div>{new Date(telemetry.timestamp).toLocaleString()}</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Battery</div>
				<div>{telemetry.batteryPct}%</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">LoRa RSSI</div>
				<div>{telemetry.loraRssi} dBm</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">LoRa SNR</div>
				<div>{telemetry.loraSnr} dB</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Danger level</div>
				<div>{sensor.dangerLevel}</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Humidity</div>
				<div>{telemetry.humidity.toFixed(1)}%</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">GPS</div>
				<div>{sensor.location.lat.toFixed(4)}, {sensor.location.lon.toFixed(4)}</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Elevation</div>
				<div>{sensor.elevation} m</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Firmware</div>
				<div>{health?.firmwareVersion ?? sensor.firmwareVersion}</div>
			</div>
			<div class="bg-surface-raised border border-surface-border rounded-2xl p-3.5">
				<div class="text-[11px] text-text-muted mb-1.5">Deployed</div>
				<div>{new Date(sensor.deployedAt).toLocaleDateString()}</div>
			</div>
		</div>

		<div class="bg-surface-base border border-surface-border rounded-2xl p-4">
			<div class="font-bold mb-2.5">Environmental readings</div>
			<ul class="list-none p-0 m-0 grid gap-2">
				<li>Temperature: {telemetry.temperature.toFixed(1)}°C</li>
				<li>Humidity: {telemetry.humidity.toFixed(1)}%</li>
				<li>CO₂: {Math.round(telemetry.co2Ppm)} ppm</li>
				<li>CO: {telemetry.coPpm} ppm</li>
				<li>Soil moisture: {telemetry.soilMoisture.toFixed(1)}%</li>
				<li>Groundwater: {telemetry.groundwaterLevel.toFixed(2)} m</li>
			</ul>
		</div>

		{#if health}
			<div class="bg-surface-base border border-surface-border rounded-2xl p-4">
				<div class="font-bold mb-2.5">Node health</div>
				<ul class="list-none p-0 m-0 grid gap-2">
					<li>Firmware: {health.firmwareVersion}</li>
					<li>Calibration: {health.calibrationStatus}</li>
					<li>Drift: {health.sensorDrift.toFixed(2)}</li>
					<li>Recommendation: {health.maintenanceRecommendation}</li>
					<li>Deployed: {new Date(sensor.deployedAt).toLocaleDateString()}</li>
				</ul>
			</div>
		{/if}

		<a
			href="/spatial-map/node/{sensor.id}"
			class="group flex items-center justify-center gap-2 px-[18px] py-[13px] rounded-[14px] bg-gradient-to-br from-[#f0783f] to-[#e05428] text-card text-sm font-bold no-underline tracking-[0.01em] shadow-[0_4px_16px_rgba(240,120,63,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[filter,transform,box-shadow] duration-180 ease-in-out hover:brightness-108 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(240,120,63,0.45),inset_0_1px_0_rgba(255,255,255,0.15)] active:translate-y-0 active:brightness-96"
			id="btn-view-node-analytics-{sensor.id}"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
			</svg>
			View Detailed Analytics
			<svg
				class="ml-auto opacity-85 transition-transform duration-180 ease-in-out group-hover:translate-x-0.75"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<line x1="5" y1="12" x2="19" y2="12" />
				<polyline points="12 5 19 12 12 19" />
			</svg>
		</a>
	{:else}
		<div class="text-text-muted text-[13px]">Select a sensor to inspect telemetry.</div>
	{/if}
</div>