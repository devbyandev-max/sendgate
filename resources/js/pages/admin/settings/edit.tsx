import { Head, useForm } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Settings = Record<string, string | number | null>;

const KEYS = [
    ['bank.name', 'Bank name'],
    ['bank.account_name', 'Account name'],
    ['bank.account_number', 'Account number'],
    ['bank.instructions', 'Bank instructions'],
    ['mail.from_address', 'From email'],
    ['mail.from_name', 'From name'],
    ['support.email', 'Support email'],
    ['invoice.prefix', 'Invoice number prefix'],
    ['timezone', 'Timezone'],
    ['pricing.standard_php', 'Standard plan price (PHP)'],
];

export default function AdminSettings({ settings }: { settings: Settings }) {
    const form = useForm({ settings: settings as any });

    const update = (key: string, value: string) => {
        form.setData('settings', { ...form.data.settings, [key]: value });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/settings', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Admin · Settings" />
            <div className="space-y-6">
                <PageHeader title="System settings" description="Bank details, email defaults, and pricing." />
                <Card className="max-w-2xl p-6">
                    <form onSubmit={submit} className="space-y-4">
                        {KEYS.map(([key, label]) => (
                            <div key={key} className="grid gap-2">
                                <Label>{label}</Label>
                                <Input
                                    value={(form.data.settings[key] as string) ?? ''}
                                    onChange={(e) => update(key, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>Save settings</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}
