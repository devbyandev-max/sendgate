import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';

export default function AdminAnalytics({ revenue_by_month, new_customers_by_month }: any) {
    return (
        <>
            <Head title="Admin · Analytics" />
            <div className="space-y-6">
                <PageHeader title="Analytics" description="Revenue and growth trends." />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly revenue</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            {revenue_by_month.map((r: any) => (
                                <li key={r.month} className="flex items-center justify-between">
                                    <span>{r.month}</span>
                                    <span className="font-mono">₱{Number(r.total).toLocaleString('en-PH')}</span>
                                </li>
                            ))}
                            {revenue_by_month.length === 0 && <p className="text-muted-foreground">No revenue yet.</p>}
                        </ul>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New customers</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            {new_customers_by_month.map((r: any) => (
                                <li key={r.month} className="flex items-center justify-between">
                                    <span>{r.month}</span>
                                    <span className="font-mono">{r.count}</span>
                                </li>
                            ))}
                            {new_customers_by_month.length === 0 && <p className="text-muted-foreground">No signups yet.</p>}
                        </ul>
                    </Card>
                </div>
            </div>
        </>
    );
}
