import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Customer = {
    id: number;
    name: string;
    email: string;
    company_name: string | null;
    status: string;
    sims_count: number;
    invoices_count: number;
    created_at: string;
};

export default function AdminCustomers({
    customers,
    filters,
}: {
    customers: { data: Customer[] };
    filters: { q: string };
}) {
    const [q, setQ] = useState(filters.q ?? '');

    return (
        <>
            <Head title="Admin · Customers" />
            <div className="space-y-6">
                <PageHeader title="Customers" description="All customer accounts." />

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onBlur={() => router.get('/admin/customers', q ? { q } : {}, { preserveState: true, preserveScroll: true })}
                            placeholder="Search…"
                            className="pl-9"
                        />
                    </div>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>SIMs</TableHead>
                                <TableHead>Invoices</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <Link href={`/admin/customers/${c.id}`} className="font-medium text-foreground hover:text-primary">
                                            {c.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">{c.email}</p>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{c.company_name ?? '—'}</TableCell>
                                    <TableCell className="text-center text-sm">{c.sims_count}</TableCell>
                                    <TableCell className="text-center text-sm">{c.invoices_count}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={c.status} />
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(c.created_at).toLocaleDateString('en-PH')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
