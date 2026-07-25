

<script lang="ts">
    import Card from '$lib/components/ui/Card.svelte';
    import { DonutChart, BarChart } from '$lib/components/charts';
    import type { NodeHealth } from '$lib/mock';

    interface Props {
        health?: NodeHealth | null;
    }

    let { health = null }: Props = $props();

    const defaultHealth: NodeHealth = {
        sensorId: 'SN-0001',
        batteryPct: 74,
        firmwareVersion: '2.5.3',
        calibrationStatus: 'Calibrated',
        signalStrength: -68,
        sensorDrift: 0.09,
        maintenanceRecommendation: 'Validate sensor calibration on next maintenance window',
        lastSeenAt: Date.now() - 110_000
    };

    const node = $derived(health ?? defaultHealth);
    const batteryPct = $derived(node.batteryPct);
    const batterySegments = $derived([
        { id: 'b', label: 'Battery', value: batteryPct, color: batteryPct < 35 ? 'var(--status-critical)' : batteryPct < 55 ? 'var(--status-warning)' : 'var(--status-online)' },
        { id: 'b2', label: 'Empty', value: 100 - batteryPct, color: 'var(--surface-overlay)' }
    ]);

    const bars = $derived([
        { id: 'battery', label: 'Battery Level', value: batteryPct, sub: '%', color: batteryPct < 35 ? 'var(--status-critical)' : batteryPct < 55 ? 'var(--status-warning)' : 'var(--status-online)' },
        { id: 'signal', label: 'Signal Strength', value: Math.min(100, Math.max(0, node.signalStrength + 120)), sub: 'dBm', color: 'var(--text-secondary)' },
        { id: 'drift', label: 'Sensor Drift', value: Math.round(node.sensorDrift * 100), sub: '%', color: node.sensorDrift > 0.12 ? 'var(--status-critical)' : 'var(--status-warning)' }
    ]);

    const nodeId = $derived(node.sensorId);
    const lastUplink = $derived(new Date(node.lastSeenAt).toLocaleString());
</script>

<Card padding="md" class="min-h-[220px]">
    <div class="flex gap-3 items-start">
        <div class="shrink-0 w-[96px] flex items-center justify-center">
            <DonutChart segments={batterySegments} size={92} strokeWidth={12} centerLabel={`${batteryPct}%`} centerSub="Battery" />
        </div>

        <div class="flex-1 flex flex-col gap-2">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-bold">Node Health Status</div>
                    <div class="text-[12px] text-text-muted">Battery, radio and sensor drift</div>
                </div>
                <div class="font-mono text-text-muted">{nodeId}</div>
            </div>

            <div>
                <BarChart bars={bars.map(b => ({ ...b, value: Math.abs(b.value) }))} orientation="horizontal" showValues={true} />
            </div>

            <div class="text-[12px] text-text-muted">Last Uplink: {lastUplink}</div>
            <div class="text-[12px] text-text-muted">Calibration: {node.calibrationStatus}</div>
            <div class="text-[12px] text-text-muted">{node.maintenanceRecommendation}</div>
        </div>
    </div>
</Card>
