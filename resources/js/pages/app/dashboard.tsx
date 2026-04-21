import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    Inbox,
    Key,
    MessageSquare,
    Radio,
    Send,
    UserPlus,
    Wallet,
} from 'lucide-react';

import { CommandTrigger } from '@/components/app/command-trigger';
import { PageHeader } from '@/components/app/page-header';
import { StatCard } from '@/components/app/stat-card';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SharedData } from '@/types';

type DashboardProps = {
    stats: { active_sims: number; sent_30d: number; delivery_rate: number; pending_php: number };
    trends: { sent: number; delivery_rate: number };
    sparklines: { sent: number[] };
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

const quickActions = [
    { href: '/app/sms/send', label: 'Send SMS', icon: Send },
    { href: '/app/contacts', label: 'Add contact', icon: UserPlus },
    { href: '/app/sms/inbox', label: 'Check inbox', icon: Inbox },
    { href: '/app/api-keys', label: 'Generate API key', icon: Key },
];

export default function CustomerDashboard({
    stats,
    trends,
    sparklines,
    recent_messages,
    pending_invoice,
}: DashboardProps) {
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
                        <>
                            <CommandTrigger className="hidden md:inline-flex" />
                            <Button asChild size="sm">
                                <Link href="/app/sms/send">
                                    <Send className="size-3.5" />
                                    Send SMS
                                </Link>
                            </Button>
                        </>
                    }
                />

                {pending_invoice && (
                    <div className="relative flex flex-col items-start justify-between gap-3 overflow-hidden rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 sm:flex-row sm:items-center">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent" />
                        <div className="relative flex items-start gap-3">
                            <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
                                <AlertCircle className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-amber-200">
                                    Invoice {pending_invoice.invoice_number} is awaiting payment
                                </p>
                                <p className="mt-0.5 text-xs text-amber-300/70">
                                    Due {new Date(pending_invoice.due_date).toLocaleDateString('en-PH')} · ₱
                                    {Number(pending_invoice.amount_php).toLocaleString('en-PH')}
                                </p>
                            </div>
                        </div>
                        <Button asChild size="sm" className="relative">
                            <Link href={`/app/billing/invoices/${pending_invoice.id}`}>
                                Pay now <ArrowUpRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Active SIMs"
                        value={stats.active_sims}
                        icon={Radio}
                        accent="success"
                        sub="Online in hardware gateway"
                    />
                    <StatCard
                        label="Sent (30d)"
                        value={stats.sent_30d.toLocaleString('en-PH')}
                        icon={MessageSquare}
                        accent="info"
                        trend={trends.sent}
                        sparkline={sparklines.sent}
                    />
                    <StatCard
                        label="Delivery rate"
                        value={`${stats.delivery_rate}%`}
                        icon={CheckCircle2}
                        accent="success"
                        trend={trends.delivery_rate}
                        sub="vs. previous 30 days"
                    />
                    <StatCard
                        label="Amount due"
                        value={`₱${stats.pending_php.toLocaleString('en-PH')}`}
                        icon={Wallet}
                        accent={stats.pending_php > 0 ? 'warning' : 'default'}
                        sub={stats.pending_php > 0 ? 'Across open invoices' : 'All invoices paid'}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                Recent activity
                            </CardTitle>
                            <Link
                                href="/app/sms/outbox"
                                className="text-xs text-primary hover:underline hover:underline-offset-4"
                            >
                                View all →
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {recent_messages.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
                                    <BarChart3 className="size-8 opacity-40" />
                                    <p>No messages yet — send your first SMS to see activity here.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-border/60">
                                    {recent_messages.map((m) => (
                                        <li
                                            key={m.id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                        {m.direction === 'outbound' ? '→' : '←'}
                                                    </span>
                                                    <span className="truncate text-sm font-medium tabular-nums">
                                                        {m.direction === 'outbound' ? m.to_number : m.from_number}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                    {m.message}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2.5">
                                                <StatusBadge status={m.status} />
                                                <span className="text-[11px] tabular-nums text-muted-foreground">
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                Quick actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1.5 pt-0">
                            {quickActions.map((action) => (
                                <QuickLink key={action.href} {...action} />
                            ))}
                            <QuickLink href="/docs" label="Read API docs" icon={MessageSquare} external />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function QuickLink({
    href,
    label,
    icon: Icon,
    external,
}: {
    href: string;
    label: string;
    icon: typeof Send;
    external?: boolean;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center justify-between rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-foreground transition-all hover:border-border-strong hover:bg-accent"
        >
            <span className="flex items-center gap-2.5">
                <Icon className="size-3.5 text-muted-foreground" />
                {label}
            </span>
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            {external}
        </Link>
    );
}
