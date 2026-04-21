import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Radio } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';

type Sim = {
    id: number;
    iccid: string;
    phone_number: string;
    carrier: string;
    label: string | null;
    port_number: number | null;
    status: string;
};

export default function SimsIndex({ sims }: { sims: Sim[] }) {
    return (
        <>
            <Head title="SIMs" />
            <div className="space-y-6">
                <PageHeader
                    title="SIMs"
                    description="Each SIM you ship to us shows up here once it's installed and active."
                    actions={
                        <Button variant="outline" asChild>
                            <a href="mailto:support@sendgate.ph?subject=Request%20SIM%20Setup">Request setup</a>
                        </Button>
                    }
                />

                {sims.length === 0 ? (
                    <EmptyState
                        icon={Radio}
                        title="You don't have any SIMs yet"
                        description="Ship your active Globe / Smart / DITO SIM to us and we'll have it online within 2–3 business days."
                        action={
                            <Button asChild>
                                <a href="mailto:support@sendgate.ph?subject=Request%20SIM%20Setup">Request setup</a>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sims.map((sim) => (
                            <Link
                                key={sim.id}
                                href={`/app/sims/${sim.id}`}
                                className="group rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {sim.carrier} · Port {sim.port_number ?? '—'}
                                    </div>
                                    <StatusBadge status={sim.status} />
                                </div>
                                <p className="mt-3 font-mono text-lg font-bold tracking-tight">{sim.phone_number}</p>
                                {sim.label && <p className="mt-1 text-sm text-muted-foreground">{sim.label}</p>}
                                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                                    Manage <ArrowRight className="size-3" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
