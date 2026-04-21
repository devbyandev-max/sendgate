import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ActivityLogs({ logs }: { logs: any }) {
    return (
        <>
            <Head title="Admin · Activity logs" />
            <div className="space-y-6">
                <PageHeader title="Activity logs" description="Audit trail of every sensitive action." />
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Causer</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Subject</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                                        No activity logged yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.data.map((log: any) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(log.created_at).toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-sm">{log.causer?.name ?? '—'}</TableCell>
                                        <TableCell className="text-sm">{log.description}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {log.subject_type ? `${log.subject_type.split('\\').pop()}#${log.subject_id}` : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
