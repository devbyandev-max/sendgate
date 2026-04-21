import { Head, router } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Sim = {
    id: number;
    iccid: string;
    phone_number: string;
    carrier: string;
    port_number: number | null;
    status: string;
    user: { id: number; name: string; email: string } | null;
};

export default function AdminSims({ sims }: { sims: { data: Sim[] } }) {
    const activate = (id: number) => {
        if (!confirm('Activate this SIM?')) return;
        router.post(`/admin/sims/${id}/activate`);
    };

    return (
        <>
            <Head title="Admin · SIMs" />
            <div className="space-y-6">
                <PageHeader title="SIMs" description="All hardware-installed SIMs across the gateway." />

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Phone</TableHead>
                                <TableHead>ICCID</TableHead>
                                <TableHead>Carrier</TableHead>
                                <TableHead>Port</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sims.data.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-mono text-sm">{s.phone_number}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{s.iccid}</TableCell>
                                    <TableCell className="text-sm uppercase">{s.carrier}</TableCell>
                                    <TableCell className="text-sm">{s.port_number ?? '—'}</TableCell>
                                    <TableCell className="text-sm">{s.user?.name ?? '—'}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={s.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {s.status !== 'active' && (
                                            <Button size="sm" variant="outline" onClick={() => activate(s.id)}>
                                                Activate
                                            </Button>
                                        )}
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
