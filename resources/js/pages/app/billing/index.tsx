import { Head, Link } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Invoice = {
    id: number;
    invoice_number: string;
    amount_php: string;
    status: string;
    due_date: string;
    paid_at: string | null;
};

type Subscription = {
    id: number;
    plan_name: string;
    price_php: string;
    next_billing_at: string;
    status: string;
    sim?: { phone_number: string; carrier: string };
};

export default function BillingIndex({ subscription, invoices }: { subscription: Subscription | null; invoices: Invoice[] }) {
    return (
        <>
            <Head title="Billing" />
            <div className="space-y-6">
                <PageHeader title="Billing" description="Subscriptions, invoices, and payment proofs." />

                {subscription ? (
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active subscription</h3>
                        <div className="mt-3 grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Plan</p>
                                <p className="font-semibold">{subscription.plan_name}</p>
                                {subscription.sim && (
                                    <p className="mt-0.5 font-mono text-xs">{subscription.sim.phone_number}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Monthly</p>
                                <p className="font-semibold">₱{Number(subscription.price_php).toLocaleString('en-PH')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Next billing</p>
                                <p className="font-semibold">
                                    {new Date(subscription.next_billing_at).toLocaleDateString('en-PH')}
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <EmptyState
                        icon={CreditCard}
                        title="No active subscription"
                        description="Once your SIM is activated by our team, your monthly subscription will start."
                    />
                )}

                <Card>
                    <div className="border-b border-border p-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Invoices</h3>
                    </div>
                    {invoices.length === 0 ? (
                        <p className="p-12 text-center text-sm text-muted-foreground">No invoices yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Number</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                                        <TableCell>₱{Number(inv.amount_php).toLocaleString('en-PH')}</TableCell>
                                        <TableCell className="text-xs">
                                            {new Date(inv.due_date).toLocaleDateString('en-PH')}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={inv.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/app/billing/invoices/${inv.id}`} className="text-xs font-semibold text-primary hover:underline">
                                                View →
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </div>
        </>
    );
}
