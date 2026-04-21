import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminCustomerShow({ customer }: { customer: any }) {
    const toggleStatus = () => {
        const action = customer.status === 'suspended' ? 'activate' : 'suspend';
        if (!confirm(`Are you sure you want to ${action} this customer?`)) return;
        router.post(`/admin/customers/${customer.id}/${action}`);
    };

    return (
        <>
            <Head title={`Admin · ${customer.name}`} />
            <div className="space-y-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/customers">
                        <ArrowLeft className="mr-1 size-3" /> All customers
                    </Link>
                </Button>

                <PageHeader
                    title={customer.name}
                    description={`${customer.email}${customer.company_name ? ` · ${customer.company_name}` : ''}`}
                    actions={
                        <>
                            <StatusBadge status={customer.status} />
                            <Button variant={customer.status === 'suspended' ? 'default' : 'destructive'} onClick={toggleStatus}>
                                {customer.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SIMs</h3>
                        {customer.sims.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">No SIMs yet.</p>
                        ) : (
                            <ul className="mt-3 space-y-2 text-sm">
                                {customer.sims.map((s: any) => (
                                    <li key={s.id} className="flex items-center justify-between">
                                        <span className="font-mono">{s.phone_number}</span>
                                        <StatusBadge status={s.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Invoices</h3>
                        {customer.invoices.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">No invoices yet.</p>
                        ) : (
                            <ul className="mt-3 space-y-2 text-sm">
                                {customer.invoices.map((i: any) => (
                                    <li key={i.id} className="flex items-center justify-between">
                                        <span className="font-mono text-xs">{i.invoice_number}</span>
                                        <span>₱{Number(i.amount_php).toLocaleString('en-PH')}</span>
                                        <StatusBadge status={i.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
