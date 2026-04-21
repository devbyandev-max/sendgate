import { Head } from '@inertiajs/react';
import { Send } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Message = {
    id: number;
    to_number: string;
    from_number: string;
    message: string;
    status: string;
    sent_at: string | null;
    delivered_at: string | null;
    created_at: string;
};

export default function OutboxIndex({ messages }: { messages: { data: Message[] } }) {
    return (
        <>
            <Head title="Outbox" />
            <div className="space-y-6">
                <PageHeader title="Outbox" description="Messages you've sent — newest first." />

                {messages.data.length === 0 ? (
                    <EmptyState icon={Send} title="No messages sent yet" description="Head to Send SMS to fire your first message." />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(m.created_at).toLocaleString('en-PH', {
                                                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                            })}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{m.to_number}</TableCell>
                                        <TableCell className="max-w-md truncate">{m.message}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={m.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </>
    );
}
