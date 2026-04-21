import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminMessages({ messages }: { messages: any }) {
    return (
        <>
            <Head title="Admin · Messages" />
            <div className="space-y-6">
                <PageHeader title="Messages" description="Global SMS log across all customers." />

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Direction</TableHead>
                                <TableHead>To/From</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages.data.map((m: any) => (
                                <TableRow key={m.id}>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(m.created_at).toLocaleString('en-PH')}
                                    </TableCell>
                                    <TableCell className="text-sm">{m.user?.name ?? '—'}</TableCell>
                                    <TableCell className="text-xs">{m.direction}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {m.direction === 'outbound' ? m.to_number : m.from_number}
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">{m.message}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={m.status} />
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
