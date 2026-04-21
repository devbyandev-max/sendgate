import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Copy, Key, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';

type ApiKey = {
    id: number;
    name: string;
    key_prefix: string;
    last_used_at: string | null;
    status: string;
    created_at: string;
};

export default function ApiKeysIndex({ keys }: { keys: ApiKey[] }) {
    const [open, setOpen] = useState(false);
    const create = useForm({ name: '' });
    const flash = (usePage().props as any).new_api_key as { name: string; prefix: string; plaintext: string } | null;
    const [revealed, setRevealed] = useState<string | null>(flash?.plaintext ?? null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        create.post('/app/api-keys', {
            preserveScroll: true,
            onSuccess: () => {
                create.reset();
                setOpen(false);
            },
        });
    };

    const revoke = (id: number) => {
        if (!confirm('Revoke this API key? This cannot be undone.')) return;
        router.delete(`/app/api-keys/${id}`, { preserveScroll: true });
    };

    const copy = () => {
        if (!revealed) return;
        navigator.clipboard.writeText(revealed);
        toast.success('API key copied to clipboard.');
    };

    return (
        <>
            <Head title="API keys" />
            <div className="space-y-6">
                <PageHeader
                    title="API keys"
                    description="Bearer tokens for the SendGate REST API."
                    actions={
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 size-4" /> Generate key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Generate API key</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input
                                            placeholder="e.g. Production server"
                                            value={create.data.name}
                                            onChange={(e) => create.setData('name', e.target.value)}
                                        />
                                        <InputError message={create.errors.name} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={create.processing}>
                                            Generate
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                {revealed && (
                    <Card className="border-amber-300/60 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-950/30">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                    Copy your API key now — it will not be shown again
                                </p>
                                <code className="mt-2 block break-all rounded-md border border-amber-300 bg-white px-3 py-2 font-mono text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
                                    {revealed}
                                </code>
                            </div>
                            <div className="flex flex-none gap-2">
                                <Button size="sm" variant="outline" onClick={copy}>
                                    <Copy className="mr-1 size-3.5" /> Copy
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setRevealed(null)}>
                                    Hide
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {keys.length === 0 ? (
                    <EmptyState
                        icon={Key}
                        title="No API keys yet"
                        description="Generate a key to start using the REST API."
                    />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Prefix</TableHead>
                                    <TableHead>Last used</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map((k) => (
                                    <TableRow key={k.id}>
                                        <TableCell className="font-medium">{k.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{k.key_prefix}_••••</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {k.last_used_at ? new Date(k.last_used_at).toLocaleString('en-PH') : 'Never'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={k.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {k.status === 'active' && (
                                                <Button size="sm" variant="ghost" onClick={() => revoke(k.id)}>
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            )}
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
