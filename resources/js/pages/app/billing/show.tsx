import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type Invoice = {
    id: number;
    invoice_number: string;
    amount_php: string;
    status: string;
    due_date: string;
    paid_at: string | null;
    payment_proofs: Array<{ id: number; status: string; uploaded_at: string; admin_notes: string | null }>;
};

type Bank = {
    name: string;
    account_name: string;
    account_number: string;
    instructions: string;
};

export default function InvoiceShow({ invoice, bank }: { invoice: Invoice; bank: Bank }) {
    const proof = useForm<{ file: File | null; amount_claimed: string; reference_number: string; bank_name: string }>({
        file: null,
        amount_claimed: invoice.amount_php,
        reference_number: invoice.invoice_number,
        bank_name: bank.name ?? '',
    });

    const submitProof = (e: React.FormEvent) => {
        e.preventDefault();
        proof.post(`/app/billing/invoices/${invoice.id}/proof`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => proof.reset(),
        });
    };

    const copy = (val: string, what: string) => {
        navigator.clipboard.writeText(val);
        toast.success(`${what} copied.`);
    };

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="space-y-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/app/billing">
                        <ArrowLeft className="mr-1 size-3" /> Back to billing
                    </Link>
                </Button>

                <PageHeader
                    title={`Invoice ${invoice.invoice_number}`}
                    description={`Due ${new Date(invoice.due_date).toLocaleDateString('en-PH')} · ₱${Number(invoice.amount_php).toLocaleString('en-PH')}`}
                    actions={
                        <>
                            <StatusBadge status={invoice.status} />
                            <Button asChild variant="outline" size="sm">
                                <a href={`/app/billing/invoices/${invoice.id}/pdf`}>
                                    <Download className="mr-1 size-3.5" /> PDF
                                </a>
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bank transfer instructions</h3>
                        <dl className="mt-4 space-y-3 text-sm">
                            {[
                                ['Bank', bank.name],
                                ['Account name', bank.account_name],
                                ['Account number', bank.account_number],
                                ['Reference', invoice.invoice_number],
                            ].map(([label, val]) => (
                                <div key={label} className="flex items-center justify-between gap-3">
                                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
                                    <dd className="flex items-center gap-2 font-mono text-xs">
                                        {val}
                                        <button onClick={() => copy(val, label)} className="text-muted-foreground hover:text-foreground">
                                            <Copy className="size-3" />
                                        </button>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-4 text-xs text-muted-foreground">{bank.instructions}</p>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Submit payment proof</h3>
                        <form onSubmit={submitProof} className="mt-4 space-y-4">
                            <div className="grid gap-2">
                                <Label>Receipt (PDF or image)</Label>
                                <Input
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => proof.setData('file', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={proof.errors.file} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Amount claimed (₱)</Label>
                                <Input
                                    value={proof.data.amount_claimed}
                                    onChange={(e) => proof.setData('amount_claimed', e.target.value)}
                                />
                                <InputError message={proof.errors.amount_claimed} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Bank reference (optional)</Label>
                                <Input
                                    value={proof.data.reference_number}
                                    onChange={(e) => proof.setData('reference_number', e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={proof.processing || !proof.data.file}>
                                {proof.processing ? 'Uploading…' : 'Submit proof'}
                            </Button>
                        </form>
                    </Card>
                </div>

                {invoice.payment_proofs.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Submitted proofs</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            {invoice.payment_proofs.map((p) => (
                                <li key={p.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                                    <span>{new Date(p.uploaded_at).toLocaleString('en-PH')}</span>
                                    <StatusBadge status={p.status} />
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>
        </>
    );
}
