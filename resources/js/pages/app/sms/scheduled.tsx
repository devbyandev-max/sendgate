import { Head, router } from '@inertiajs/react';
import { Timer, Trash2 } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Scheduled = {
    id: number;
    to_number: string;
    message: string;
    scheduled_at: string;
};

export default function ScheduledIndex({ scheduled }: { scheduled: Scheduled[] }) {
    const cancel = (id: number) => {
        if (!confirm('Cancel this scheduled message?')) return;
        router.delete(`/app/sms/scheduled/${id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Scheduled" />
            <div className="space-y-6">
                <PageHeader title="Scheduled" description="Messages waiting to be sent." />

                {scheduled.length === 0 ? (
                    <EmptyState icon={Timer} title="No scheduled messages" description="Schedule a send from any compose form." />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>When</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduled.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-xs">
                                            {new Date(m.scheduled_at).toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{m.to_number}</TableCell>
                                        <TableCell className="max-w-md truncate">{m.message}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" onClick={() => cancel(m.id)}>
                                                <Trash2 className="size-3.5" />
                                            </Button>
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
