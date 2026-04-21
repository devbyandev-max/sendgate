import { Head, useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';

type Sim = { id: number; phone_number: string; carrier: string; label: string | null };

export default function SmsSend({ sims }: { sims: Sim[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        sim_id: sims[0]?.id?.toString() ?? '',
        to: '',
        message: '',
    });

    const segments = Math.max(1, Math.ceil(data.message.length / 160));

    return (
        <>
            <Head title="Send SMS" />

            <div className="space-y-6">
                <PageHeader title="Send SMS" description="Send a single message instantly through one of your SIMs." />

                <Card className="max-w-2xl p-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post('/app/sms/send', {
                                preserveScroll: true,
                                onSuccess: () => reset('to', 'message'),
                            });
                        }}
                        className="space-y-5"
                    >
                        <div className="grid gap-2">
                            <Label>From SIM</Label>
                            <Select value={data.sim_id} onValueChange={(v) => setData('sim_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={sims.length ? 'Select a SIM' : 'No active SIMs'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {sims.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.phone_number} · {s.carrier.toUpperCase()}
                                            {s.label && ` · ${s.label}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.sim_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="to">To</Label>
                            <Input
                                id="to"
                                placeholder="+639171234567 or 09171234567"
                                value={data.to}
                                onChange={(e) => setData('to', e.target.value)}
                            />
                            <InputError message={errors.to} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="message">Message</Label>
                                <span className="font-mono text-xs text-muted-foreground">
                                    {data.message.length} chars · {segments} segment{segments !== 1 && 's'}
                                </span>
                            </div>
                            <Textarea
                                id="message"
                                rows={5}
                                placeholder="Type your message…"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className="resize-y"
                            />
                            <InputError message={errors.message} />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing || !data.sim_id}>
                                <Send className="mr-2 size-4" />
                                {processing ? 'Sending…' : 'Send SMS'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}
