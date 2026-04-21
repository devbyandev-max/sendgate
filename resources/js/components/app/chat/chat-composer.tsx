import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SimOption = { id: number; phone_number: string; label: string | null; carrier: string };

type Props = {
    /** Pre-selected SIM */
    defaultSimId?: string;
    /** Pre-filled recipient (e.g. when replying in a thread) */
    defaultTo?: string;
    /** Lock the recipient field (thread context). */
    lockRecipient?: boolean;
    sims: SimOption[];
    className?: string;
    /** Called after successful submit, e.g. to scroll the thread. */
    onSent?: () => void;
};

export function ChatComposer({
    defaultSimId = '',
    defaultTo = '',
    lockRecipient = false,
    sims,
    className,
    onSent,
}: Props) {
    const taRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm({
        sim_id: defaultSimId || sims[0]?.id?.toString() || '',
        to: defaultTo,
        message: '',
    });

    // Autosize
    useEffect(() => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    }, [form.data.message]);

    // Keep the form's "to" and "sim_id" synced when the parent thread changes
    useEffect(() => {
        if (defaultTo) form.setData('to', defaultTo);
        if (defaultSimId) form.setData('sim_id', defaultSimId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultTo, defaultSimId]);

    const segments = Math.max(1, Math.ceil(form.data.message.length / 160));
    const canSend = form.data.sim_id && form.data.to && form.data.message.trim().length > 0;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSend || form.processing) return;
        form.post('/app/conversations', {
            preserveScroll: true,
            onSuccess: () => {
                form.setData('message', '');
                onSent?.();
                taRef.current?.focus();
            },
        });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            submit(e as unknown as React.FormEvent);
        }
    };

    return (
        <form
            onSubmit={submit}
            className={cn('border-t border-border bg-background p-3', className)}
        >
            {/* Meta: SIM + recipient */}
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span>From</span>
                    <Select value={form.data.sim_id} onValueChange={(v) => form.setData('sim_id', v)}>
                        <SelectTrigger className="h-6 w-auto gap-1 rounded-md border-border bg-surface px-1.5 py-0 text-[11px] font-mono tabular-nums">
                            <SelectValue placeholder="SIM" />
                        </SelectTrigger>
                        <SelectContent>
                            {sims.map((s) => (
                                <SelectItem key={s.id} value={s.id.toString()} className="text-[12px]">
                                    {s.phone_number}
                                    <span className="ml-2 text-muted-foreground">{s.carrier.toUpperCase()}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <span className="text-muted-foreground/40">→</span>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span>To</span>
                    {lockRecipient ? (
                        <span className="font-mono tabular-nums text-foreground">{form.data.to}</span>
                    ) : (
                        <input
                            value={form.data.to}
                            onChange={(e) => form.setData('to', e.target.value)}
                            placeholder="+639171234567"
                            className="h-6 w-36 rounded-md border border-border bg-surface px-2 font-mono text-[11px] tabular-nums outline-none focus:border-primary/60"
                        />
                    )}
                </div>

                {form.errors.to && (
                    <span className="text-destructive">{form.errors.to}</span>
                )}
            </div>

            {/* Composer */}
            <div
                className={cn(
                    'group flex items-end gap-2 rounded-lg border border-border bg-surface p-2',
                    'transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/25',
                )}
            >
                <textarea
                    ref={taRef}
                    value={form.data.message}
                    onChange={(e) => form.setData('message', e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Write a message…"
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-2 py-1.5 text-[13px] outline-none placeholder:text-muted-foreground"
                />

                <div className="flex items-center gap-1.5">
                    {form.data.message.length > 0 && (
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                            {form.data.message.length} · {segments}
                        </span>
                    )}
                    <Button
                        type="submit"
                        size="icon-sm"
                        disabled={!canSend || form.processing}
                        aria-label="Send"
                    >
                        <Send className="size-3.5" />
                    </Button>
                </div>
            </div>

            {form.errors.message && (
                <p className="mt-1 text-[11px] text-destructive">{form.errors.message}</p>
            )}
            <p className="mt-1 text-[10px] text-muted-foreground">
                <span className="kbd">⌘</span> <span className="kbd">↵</span> to send · {segments} segment
                {segments !== 1 && 's'}
            </p>
        </form>
    );
}
