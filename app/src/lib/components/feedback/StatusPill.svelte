<script lang="ts">
	interface Props { status: 'online' | 'offline' | 'warning' | 'critical' | 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive' | 'monitoring' | 'suspicious'; }
	let { status }: Props = $props();
	const labels: Record<string, string> = {
		online: 'Online', offline: 'Offline', warning: 'Warning', critical: 'Critical', open: 'Open',
		acknowledged: 'Acknowledged', investigating: 'Investigating', resolved: 'Resolved', false_positive: 'False positive',
		monitoring: 'Monitoring', suspicious: 'Suspicious'
	};
	const statusStyles: Record<string, string> = {
		online: 'bg-success/15 text-success',
		resolved: 'bg-success/15 text-success',
		acknowledged: 'bg-success/15 text-success',
		warning: 'bg-warning/15 text-warning',
		suspicious: 'bg-warning/15 text-warning',
		investigating: 'bg-warning/15 text-warning',
		critical: 'bg-danger/15 text-danger',
		open: 'bg-danger/15 text-danger',
		offline: 'bg-surface-subtle text-text-muted',
		false_positive: 'bg-surface-subtle text-text-muted',
		monitoring: 'bg-surface-subtle text-text-muted'
	};
</script>

<span class="inline-flex items-center gap-[0.4rem] rounded-full px-[0.58rem] py-[0.25rem] text-[0.74rem] font-[650] leading-none whitespace-nowrap {statusStyles[status] ?? 'bg-surface-subtle text-text-muted'}"><span class="w-[0.42rem] h-[0.42rem] rounded-full bg-current"></span>{labels[status] ?? status}</span>
