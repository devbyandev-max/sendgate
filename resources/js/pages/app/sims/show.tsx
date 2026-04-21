import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { StatCard } from '@/components/app/stat-card';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SimShow({ sim, recent_messages, stats }: any) {
    return (
        <>
            <Head title={`SIM ${sim.phone_number}`} />
            <div className="space-y-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/app/sims">
                        <ArrowLeft className="mr-1 size-3" /> All SIMs
                    </Link>
                </Button>

                <PageHeader
                    title={sim.phone_number}
                    description={`${sim.carrier.toUpperCase()} · ICCID ${sim.iccid}`}
                    actions={<StatusBadge status={sim.status} />}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Sent (lifetime)" value={stats.total_sent.toLocaleString('en-PH')} />
                    <StatCard label="Received (lifetime)" value={stats.total_received.toLocaleString('en-PH')} />
                    <StatCard label="Port" value={sim.port_number ?? '—'} />
                </div>

                <Card className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent messages</h3>
                    <ul className="mt-4 divide-y divide-border">
                        {recent_messages.map((m: any) => (
                            <li key={m.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                                <span className="font-mono text-xs text-muted-foreground">
                                    {m.direction === 'outbound' ? '→' : '←'}
                                </span>
                                <span className="flex-1 truncate">{m.message}</span>
                                <StatusBadge status={m.status} />
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </>
    );
}
