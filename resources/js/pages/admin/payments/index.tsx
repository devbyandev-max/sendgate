import { Head, router } from '@inertiajs/react';
import { Check, Eye, X } from 'lucide-react';
import { useState } from 'react';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

type Proof = {
    id: number;
    file_path: string;
    amount_claimed: string;
    reference_number: string | null;
    bank_name: string | null;
    uploaded_at: string;
    status: string;
    user: { name: string; email: string; company_name: string | null };
    invoice: { invoice_number: string; amount_php: string };
};

export default function AdminPayments({ proofs }: { proofs: { data: Proof[] } }) {
    const [reviewing, setReviewing] = useState<Proof | null>(null);
    const [rejectionNotes, setRejectionNotes] = useState('');

    const approve = (proof: Proof) => {
        if (!confirm(`Approve payment for invoice ${proof.invoice.invoice_number}?`)) return;
        router.post(`/admin/payments/${proof.id}/approve`, {}, { preserveScroll: true, onSuccess: () => setReviewing(null) });
    };

    const reject = () => {
        if (!reviewing) return;
        router.post(`/admin/payments/${reviewing.id}/reject`, { admin_notes: rejectionNotes }, {
            preserveScroll: true,
            onSuccess: () => {
                setReviewing(null);
                setRejectionNotes('');
            },
        });
    };

    return (
        <>
            <Head title="Admin · Payments" />
            <div className="space-y-6">
                <PageHeader title="Payment review" description="Approve or reject submitted bank-transfer payment proofs." />

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Claimed</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proofs.data.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <p className="font-medium">{p.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.user.email}</p>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{p.invoice.invoice_number}</TableCell>
                                    <TableCell>₱{Number(p.amount_claimed).toLocaleString('en-PH')}</TableCell>
                                    <TableCell className="font-mono text-xs">{p.reference_number ?? '—'}</TableCell>
                                    <TableCell className="text-xs">{new Date(p.uploaded_at).toLocaleString('en-PH')}</TableCell>
                                    <TableCell><StatusBadge status={p.status} /></TableCell>
                                    <TableCell className="text-right">
                                        {p.status === 'pending' && (
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="outline" onClick={() => setReviewing(p)}>
                                                    <Eye className="size-3.5" />
                                                </Button>
                                                <Button size="sm" onClick={() => approve(p)}>
                                                    <Check className="size-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Dialog open={!!reviewing} onOpenChange={(v) => !v && setReviewing(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Review payment proof</DialogTitle>
                        </DialogHeader>
                        {reviewing && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Customer</p>
                                        <p className="font-medium">{reviewing.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Invoice</p>
                                        <p className="font-mono">{reviewing.invoice.invoice_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Invoice amount</p>
                                        <p className="font-medium">₱{Number(reviewing.invoice.amount_php).toLocaleString('en-PH')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Claimed</p>
                                        <p className="font-medium">₱{Number(reviewing.amount_claimed).toLocaleString('en-PH')}</p>
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Reason for rejection (required if rejecting)…"
                                    value={rejectionNotes}
                                    onChange={(e) => setRejectionNotes(e.target.value)}
                                />

                                <DialogFooter className="gap-2 sm:gap-2">
                                    <Button variant="destructive" onClick={reject} disabled={!rejectionNotes.trim()}>
                                        <X className="mr-1 size-3.5" /> Reject
                                    </Button>
                                    <Button onClick={() => approve(reviewing)}>
                                        <Check className="mr-1 size-3.5" /> Approve
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
