import { Head } from '@inertiajs/react';
import { BarChart3, CheckCircle2, Radio, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { StatCard } from '@/components/app/stat-card';
import { Card } from '@/components/ui/card';

type Props = {
    kpis: { total_sent: number; delivery_rate: number; failed: number; active_sims: number };
    by_day: Array<{ day: string; count: number }>;
    by_sim: Array<{ sim_id: number; count: number }>;
};

export default function Analytics({ kpis, by_day, by_sim }: Props) {
    const max = Math.max(1, ...by_day.map((d) => d.count));

    return (
        <>
            <Head title="Analytics" />
            <div className="space-y-6">
                <PageHeader title="Analytics" description="Last 30 days of activity." />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total sent" value={kpis.total_sent.toLocaleString('en-PH')} icon={BarChart3} />
                    <StatCard label="Delivery rate" value={`${kpis.delivery_rate}%`} icon={CheckCircle2} accent="success" />
                    <StatCard label="Failed" value={kpis.failed} icon={XCircle} accent={kpis.failed > 0 ? 'danger' : 'default'} />
                    <StatCard label="Active SIMs" value={kpis.active_sims} icon={Radio} />
                </div>

                <Card className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Messages over time</h3>
                    <div className="mt-6 flex items-end gap-1 h-40">
                        {by_day.map((d) => (
                            <div key={d.day} className="flex-1" title={`${d.day}: ${d.count}`}>
                                <div
                                    className="w-full rounded-t bg-primary/60"
                                    style={{ height: `${(d.count / max) * 100}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">By SIM</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        {by_sim.map((s) => (
                            <li key={s.sim_id} className="flex items-center justify-between">
                                <span>SIM #{s.sim_id}</span>
                                <span className="font-mono text-xs">{s.count.toLocaleString('en-PH')}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </>
    );
}
