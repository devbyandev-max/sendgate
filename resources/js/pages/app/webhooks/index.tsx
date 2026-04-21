import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Webhook } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';

const EVENTS = [
    'message.delivered',
    'message.failed',
    'message.received',
    'sim.suspended',
    'invoice.generated',
    'payment.approved',
];

type WebhookRow = {
    id: number;
    url: string;
    events: string[];
    status: string;
    last_triggered_at: string | null;
};

export default function WebhooksIndex({ webhooks }: { webhooks: WebhookRow[] }) {
    const [open, setOpen] = useState(false);
    const create = useForm<{ url: string; events: string[] }>({ url: '', events: [] });

    const toggleEvent = (e: string) => {
        create.setData(
            'events',
            create.data.events.includes(e) ? create.data.events.filter((x) => x !== e) : [...create.data.events, e],
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        create.post('/app/webhooks', {
            preserveScroll: true,
            onSuccess: () => {
                create.reset();
                setOpen(false);
            },
        });
    };

    const remove = (id: number) => {
        if (!confirm('Delete this webhook?')) return;
        router.delete(`/app/webhooks/${id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Webhooks" />
            <div className="space-y-6">
                <PageHeader
                    title="Webhooks"
                    description="Receive HTTPS callbacks for SMS events, signed with your secret."
                    actions={
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 size-4" /> Add webhook
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New webhook</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>URL</Label>
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/webhooks/sendgate"
                                            value={create.data.url}
                                            onChange={(e) => create.setData('url', e.target.value)}
                                        />
                                        <InputError message={create.errors.url} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Events</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {EVENTS.map((evt) => (
                                                <label key={evt} className="flex items-center gap-2 text-sm">
                                                    <Checkbox
                                                        checked={create.data.events.includes(evt)}
                                                        onCheckedChange={() => toggleEvent(evt)}
                                                    />
                                                    <span className="font-mono text-xs">{evt}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={create.errors.events} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={create.processing}>
                                            Add webhook
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
                    Webhook delivery is configured here now. Events will start flowing once your SIM is active and you start
                    sending or receiving messages.
                </div>

                {webhooks.length === 0 ? (
                    <EmptyState icon={Webhook} title="No webhooks yet" description="Add your first endpoint above." />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Events</TableHead>
                                    <TableHead>Last triggered</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {webhooks.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="max-w-md truncate font-mono text-xs">{w.url}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {w.events.length} event{w.events.length !== 1 && 's'}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {w.last_triggered_at ? new Date(w.last_triggered_at).toLocaleString('en-PH') : 'Never'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={w.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="ghost" onClick={() => remove(w.id)}>
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
