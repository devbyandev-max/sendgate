import { Head, Link } from '@inertiajs/react';
import { CreditCard, MessageSquare, Radio, Receipt, Users } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { StatCard } from '@/components/app/stat-card';
import { Card } from '@/components/ui/card';

type Props = {
    kpis: {
        mrr_php: number;
        active_sims: number;
        active_customers: number;
        pending_payments: number;
        messages_24h: number;
    };
    recent_signups: Array<{ id: number; name: string; email: string; company_name: string | null; created_at: string }>;
    pending_payments: Array<{
        id: number;
        amount_claimed: string;
        uploaded_at: string;
        user: { name: string; email: string };
        invoice: { invoice_number: string; amount_php: string };
    }>;
};

export default function AdminDashboard({ kpis, recent_signups, pending_payments }: Props) {
    return (
        <>
            <Head title="Admin · Dashboard" />
            <div className="space-y-6">
                <PageHeader title="Admin dashboard" description="Operational overview." />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard label="MRR" value={`₱${kpis.mrr_php.toLocaleString('en-PH')}`} icon={Receipt} accent="success" />
                    <StatCard label="Active SIMs" value={kpis.active_sims} icon={Radio} />
                    <StatCard label="Customers" value={kpis.active_customers} icon={Users} />
                    <StatCard label="Pending payments" value={kpis.pending_payments} icon={CreditCard} accent={kpis.pending_payments > 0 ? 'warning' : 'default'} />
                    <StatCard label="SMS (24h)" value={kpis.messages_24h.toLocaleString('en-PH')} icon={MessageSquare} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent signups</h3>
                            <Link href="/admin/customers" className="text-xs text-primary hover:underline">View all →</Link>
                        </div>
                        <ul className="mt-4 divide-y divide-border">
                            {recent_signups.map((u) => (
                                <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                                    <div>
                                        <p className="font-medium">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}{u.company_name && ` · ${u.company_name}`}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(u.created_at).toLocaleDateString('en-PH')}
                                    </span>
                                </li>
                            ))}
                            {recent_signups.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No signups yet.</p>}
                        </ul>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Awaiting review</h3>
                            <Link href="/admin/payments" className="text-xs text-primary hover:underline">View all →</Link>
                        </div>
                        <ul className="mt-4 divide-y divide-border">
                            {pending_payments.map((p) => (
                                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                                    <div>
                                        <p className="font-medium">{p.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.invoice.invoice_number} · ₱{Number(p.amount_claimed).toLocaleString('en-PH')}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(p.uploaded_at).toLocaleDateString('en-PH')}
                                    </span>
                                </li>
                            ))}
                            {pending_payments.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Inbox zero. Nice.</p>}
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
}
