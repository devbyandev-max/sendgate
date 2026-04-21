import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, BarChart3, CheckCircle2, MessageSquare, Radio, Wallet } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { StatCard } from '@/components/app/stat-card';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SharedData } from '@/types';

type DashboardProps = {
    stats: { active_sims: number; sent_30d: number; delivery_rate: number; pending_php: number };
    recent_messages: Array<{
        id: number;
        direction: string;
        to_number: string;
        from_number: string;
        message: string;
        status: string;
        created_at: string;
    }>;
    pending_invoice: { id: number; invoice_number: string; amount_php: string; due_date: string } | null;
};

export default function CustomerDashboard({ stats, recent_messages, pending_invoice }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user.name.split(' ')[0];

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <PageHeader
                    title={`Welcome back, ${firstName}`}
                    description="Here's what's happening with your SMS gateway."
                    actions={
                        <Button asChild>
                            <Link href="/app/sms/send">Send SMS</Link>
                        </Button>
                    }
                />

                {pending_invoice && (
                    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 sm:flex-row sm:items-center dark:border-amber-700/40 dark:bg-amber-950/30">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 size-5 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                    Invoice {pending_invoice.invoice_number} is awaiting payment
                                </p>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                                    Due {new Date(pending_invoice.due_date).toLocaleDateString('en-PH')} · ₱
                                    {Number(pending_invoice.amount_php).toLocaleString('en-PH')}
                                </p>
                            </div>
                        </div>
                        <Button asChild size="sm">
                            <Link href={`/app/billing/invoices/${pending_invoice.id}`}>Pay now</Link>
                        </Button>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Active SIMs" value={stats.active_sims} icon={Radio} accent="success" />
                    <StatCard label="Sent (30d)" value={stats.sent_30d.toLocaleString('en-PH')} icon={MessageSquare} />
                    <StatCard
                        label="Delivery rate"
                        value={`${stats.delivery_rate}%`}
                        icon={CheckCircle2}
                        accent="success"
                    />
                    <StatCard
                        label="Amount due"
                        value={`₱${stats.pending_php.toLocaleString('en-PH')}`}
                        icon={Wallet}
                        accent={stats.pending_php > 0 ? 'warning' : 'default'}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="p-6 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Recent activity
                            </h3>
                            <Link href="/app/sms/outbox" className="text-xs text-primary hover:underline">
                                View all →
                            </Link>
                        </div>

                        {recent_messages.length === 0 ? (
                            <div className="mt-6 flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
                                <BarChart3 className="size-8 opacity-50" />
                                <p>No messages yet — send your first SMS to see activity here.</p>
                            </div>
                        ) : (
                            <ul className="mt-4 divide-y divide-border">
                                {recent_messages.map((m) => (
                                    <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {m.direction === 'outbound' ? '→' : '←'}
                                                </span>
                                                <span className="truncate text-sm font-medium">
                                                    {m.direction === 'outbound' ? m.to_number : m.from_number}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{m.message}</p>
                                        </div>
                                        <div className="flex flex-none items-center gap-2">
                                            <StatusBadge status={m.status} />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(m.created_at).toLocaleTimeString('en-PH', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Quick actions
                        </h3>
                        <div className="mt-4 space-y-2">
                            <QuickLink href="/app/sms/send" label="Send a single SMS" />
                            <QuickLink href="/app/contacts" label="Add a contact" />
                            <QuickLink href="/app/sms/inbox" label="Check inbox" />
                            <QuickLink href="/app/api-keys" label="Generate API key" />
                            <QuickLink href="/docs" label="Read API docs" external />
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

function QuickLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
    return (
        <Link
            href={href}
            className="block rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
        >
            {label} {external && <span className="text-muted-foreground">↗</span>}
        </Link>
    );
}
