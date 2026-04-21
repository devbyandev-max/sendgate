import { Check, CheckCheck, CircleAlert, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ThreadMessage = {
    id: number;
    direction: 'outbound' | 'inbound';
    from_number: string;
    to_number: string;
    message: string;
    status: string;
    segments: number;
    sent_at: string | null;
    delivered_at: string | null;
    created_at: string;
};

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
}

function statusIcon(status: string, className?: string) {
    switch (status) {
        case 'delivered':
            return <CheckCheck className={cn('size-3 text-emerald-400', className)} />;
        case 'sent':
            return <Check className={cn('size-3 text-muted-foreground', className)} />;
        case 'queued':
        case 'sending':
            return <Clock className={cn('size-3 text-muted-foreground motion-safe:animate-pulse', className)} />;
        case 'failed':
            return <CircleAlert className={cn('size-3 text-red-400', className)} />;
        default:
            return null;
    }
}

export function MessageBubble({ message }: { message: ThreadMessage }) {
    const isOutbound = message.direction === 'outbound';

    return (
        <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
            <div className="flex max-w-[78%] flex-col gap-1">
                <div
                    className={cn(
                        'group relative rounded-2xl px-3.5 py-2 text-[13px] leading-snug',
                        isOutbound
                            ? 'rounded-br-sm bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_8%)] text-primary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_1px_2px_0_rgb(0_0_0/0.2)]'
                            : 'rounded-bl-sm bg-surface text-foreground border border-border shadow-[inset_0_1px_0_0_rgb(255_255_255/0.03)]',
                    )}
                >
                    <p className="whitespace-pre-wrap break-words">{message.message}</p>
                </div>

                {/* Meta row */}
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground',
                        isOutbound ? 'justify-end' : 'justify-start',
                    )}
                >
                    <span className="tabular-nums">{formatTime(message.created_at)}</span>
                    {message.segments > 1 && (
                        <>
                            <span className="opacity-50">·</span>
                            <span>
                                {message.segments} segments
                            </span>
                        </>
                    )}
                    {isOutbound && (
                        <>
                            <span className="opacity-50">·</span>
                            {statusIcon(message.status)}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
