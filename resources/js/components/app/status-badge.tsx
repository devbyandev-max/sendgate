import { cn } from '@/lib/utils';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'muted';

const toneClasses: Record<Tone, { bg: string; text: string; dot: string; border: string }> = {
    success: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-300',
        dot: 'bg-emerald-400',
        border: 'border-emerald-500/25',
    },
    warning: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-300',
        dot: 'bg-amber-400',
        border: 'border-amber-500/25',
    },
    danger: {
        bg: 'bg-red-500/10',
        text: 'text-red-300',
        dot: 'bg-red-400',
        border: 'border-red-500/25',
    },
    info: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-300',
        dot: 'bg-blue-400',
        border: 'border-blue-500/25',
    },
    muted: {
        bg: 'bg-muted/60',
        text: 'text-muted-foreground',
        dot: 'bg-muted-foreground/50',
        border: 'border-border',
    },
};

const STATUS_TONE: Record<string, Tone> = {
    delivered: 'success',
    sent: 'success',
    received: 'success',
    active: 'success',
    paid: 'success',
    approved: 'success',
    completed: 'success',
    queued: 'info',
    sending: 'info',
    pending: 'warning',
    pending_shipment: 'warning',
    past_due: 'warning',
    scheduled: 'info',
    running: 'info',
    overdue: 'danger',
    failed: 'danger',
    rejected: 'danger',
    suspended: 'danger',
    cancelled: 'muted',
    revoked: 'muted',
    paused: 'muted',
    draft: 'muted',
};

const LABELS: Record<string, string> = {
    pending_shipment: 'Pending shipment',
    past_due: 'Past due',
};

function humanize(s: string) {
    return LABELS[s] ?? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({
    status,
    className,
    pulse,
}: {
    status: string;
    className?: string;
    pulse?: boolean;
}) {
    const t = STATUS_TONE[status] ?? 'muted';
    const c = toneClasses[t];
    const isLive = status === 'running' || status === 'sending' || status === 'queued';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[11px] font-medium',
                c.bg,
                c.text,
                c.border,
                className,
            )}
        >
            <span
                className={cn(
                    'inline-block size-1.5 rounded-full',
                    c.dot,
                    (pulse ?? isLive) && 'motion-safe:animate-pulse',
                )}
            />
            {humanize(status)}
        </span>
    );
}
