import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminInvoices({ invoices }: { invoices: any }) {
    return (
        <>
            <Head title="Admin · Invoices" />
            <div className="space-y-6">
                <PageHeader title="Invoices" description="All invoices system-wide." />
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Due</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.data.map((inv: any) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                                    <TableCell className="text-sm">{inv.user?.name ?? '—'}</TableCell>
                                    <TableCell>₱{Number(inv.amount_php).toLocaleString('en-PH')}</TableCell>
                                    <TableCell className="text-xs">{new Date(inv.due_date).toLocaleDateString('en-PH')}</TableCell>
                                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
