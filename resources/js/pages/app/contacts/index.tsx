import { Head, router, useForm } from '@inertiajs/react';
import { Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/components/input-error';

type Contact = { id: number; name: string; phone_number: string; email: string | null };

export default function ContactsIndex({
    contacts,
    filters,
}: {
    contacts: { data: Contact[] };
    filters: { q: string };
}) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState(filters.q ?? '');

    const create = useForm({ name: '', phone_number: '', email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        create.post('/app/contacts', {
            preserveScroll: true,
            onSuccess: () => {
                create.reset();
                setOpen(false);
            },
        });
    };

    const remove = (id: number) => {
        if (!confirm('Delete this contact?')) return;
        router.delete(`/app/contacts/${id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Contacts" />
            <div className="space-y-6">
                <PageHeader
                    title="Contacts"
                    description="Address book for outbound messages and campaigns."
                    actions={
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="mr-2 size-4" /> Add contact
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New contact</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input value={create.data.name} onChange={(e) => create.setData('name', e.target.value)} />
                                        <InputError message={create.errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Phone</Label>
                                        <Input
                                            placeholder="+63917…"
                                            value={create.data.phone_number}
                                            onChange={(e) => create.setData('phone_number', e.target.value)}
                                        />
                                        <InputError message={create.errors.phone_number} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Email (optional)</Label>
                                        <Input value={create.data.email} onChange={(e) => create.setData('email', e.target.value)} />
                                        <InputError message={create.errors.email} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={create.processing}>
                                            Add contact
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onBlur={() => router.get('/app/contacts', q ? { q } : {}, { preserveState: true, preserveScroll: true })}
                            placeholder="Search by name, phone, or email…"
                            className="pl-9"
                        />
                    </div>
                </div>

                {contacts.data.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No contacts yet"
                        description="Add contacts one at a time, or import from CSV."
                    />
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{c.phone_number}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{c.email ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
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
