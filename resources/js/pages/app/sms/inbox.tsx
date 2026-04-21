import { Head } from '@inertiajs/react';
import { Inbox } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Message = {
    id: number;
    from_number: string;
    to_number: string;
    message: string;
    status: string;
    created_at: string;
};

export default function InboxIndex({ messages }: { messages: { data: Message[] } }) {
    return (
        <>
            <Head title="Inbox" />
            <div className="space-y-6">
                <PageHeader title="Inbox" description="Replies and inbound SMS to your SIMs." />

                {messages.data.length === 0 ? (
                    <EmptyState icon={Inbox} title="Your inbox is empty" description="When customers reply to your messages, they'll show up here." />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>SIM</TableHead>
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
                                        <TableCell className="font-mono text-xs">{m.from_number}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{m.to_number}</TableCell>
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
