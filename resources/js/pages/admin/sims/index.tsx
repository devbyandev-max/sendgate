import { Head, router, useForm } from '@inertiajs/react';
import { Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Customer = { id: number; name: string; email: string };

type Sim = {
    id: number;
    iccid: string;
    phone_number: string;
    carrier: string;
    port_number: number | null;
    status: string;
    user: { id: number; name: string; email: string } | null;
};

const UNASSIGNED = '__none__';

export default function AdminSims({ sims, customers }: { sims: { data: Sim[] }; customers: Customer[] }) {
    const [addOpen, setAddOpen] = useState(false);
    const [assigning, setAssigning] = useState<Sim | null>(null);

    const add = useForm<{
        iccid: string;
        phone_number: string;
        carrier: string;
        port_number: string;
        user_id: string;
    }>({
        iccid: '',
        phone_number: '',
        carrier: 'globe',
        port_number: '',
        user_id: UNASSIGNED,
    });

    const assign = useForm<{ user_id: string }>({ user_id: '' });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        add.transform((d) => ({
            ...d,
            port_number: d.port_number === '' ? null : Number(d.port_number),
            user_id: d.user_id === UNASSIGNED ? null : Number(d.user_id),
        }));
        add.post('/admin/sims', {
            preserveScroll: true,
            onSuccess: () => {
                add.reset();
                setAddOpen(false);
            },
        });
    };

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!assigning) return;
        assign.transform((d) => ({ user_id: Number(d.user_id) }));
        assign.post(`/admin/sims/${assigning.id}/assign`, {
            preserveScroll: true,
            onSuccess: () => {
                assign.reset();
                setAssigning(null);
            },
        });
    };

    const activate = (id: number) => {
        if (!confirm('Activate this SIM?')) return;
        router.post(`/admin/sims/${id}/activate`);
    };

    return (
        <>
            <Head title="Admin · SIMs" />
            <div className="space-y-6">
                <PageHeader
                    title="SIMs"
                    description="All hardware-installed SIMs across the gateway."
                    actions={
                        <Button onClick={() => setAddOpen(true)}>
                            <Plus className="mr-1 size-4" /> Add SIM
                        </Button>
                    }
                />

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
                                    <TableCell className="space-x-2 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                assign.setData('user_id', s.user?.id ? String(s.user.id) : '');
                                                setAssigning(s);
                                            }}
                                        >
                                            <UserPlus className="mr-1 size-3.5" />
                                            {s.user ? 'Reassign' : 'Assign'}
                                        </Button>
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

            <Dialog open={addOpen} onOpenChange={(v) => !v && setAddOpen(false)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add SIM</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submitAdd}>
                        <div className="grid gap-2">
                            <Label htmlFor="iccid">ICCID</Label>
                            <Input
                                id="iccid"
                                value={add.data.iccid}
                                onChange={(e) => add.setData('iccid', e.target.value)}
                                placeholder="89630XXXXXXXXXXXXXX"
                                autoFocus
                            />
                            {add.errors.iccid && <p className="text-xs text-destructive">{add.errors.iccid}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    id="phone"
                                    value={add.data.phone_number}
                                    onChange={(e) => add.setData('phone_number', e.target.value)}
                                    placeholder="+639171234567"
                                />
                                {add.errors.phone_number && <p className="text-xs text-destructive">{add.errors.phone_number}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="port">Hardware port</Label>
                                <Input
                                    id="port"
                                    type="number"
                                    min={1}
                                    value={add.data.port_number}
                                    onChange={(e) => add.setData('port_number', e.target.value)}
                                    placeholder="1"
                                />
                                {add.errors.port_number && <p className="text-xs text-destructive">{add.errors.port_number}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Carrier</Label>
                            <Select value={add.data.carrier} onValueChange={(v) => add.setData('carrier', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="globe">Globe</SelectItem>
                                    <SelectItem value="smart">Smart</SelectItem>
                                    <SelectItem value="dito">DITO</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Customer (optional)</Label>
                            <Select value={add.data.user_id} onValueChange={(v) => add.setData('user_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name} — {c.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={add.processing}>
                                {add.processing ? 'Adding…' : 'Add SIM'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!assigning} onOpenChange={(v) => !v && setAssigning(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{assigning?.user ? 'Reassign SIM' : 'Assign SIM'}</DialogTitle>
                    </DialogHeader>
                    {assigning && (
                        <form className="space-y-4" onSubmit={submitAssign}>
                            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                                <p>
                                    <span className="text-muted-foreground">Phone:</span> <span className="font-mono">{assigning.phone_number}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Port:</span> {assigning.port_number ?? '—'}
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Customer</Label>
                                <Select value={assign.data.user_id} onValueChange={(v) => assign.setData('user_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a customer…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name} — {c.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {assign.errors.user_id && <p className="text-xs text-destructive">{assign.errors.user_id}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setAssigning(null)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={!assign.data.user_id || assign.processing}>
                                    {assign.processing ? 'Saving…' : 'Assign'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
