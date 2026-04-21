import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tone: Record<string, string> = {
    success: 'bg-brand-100 text-brand-800 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-200',
    warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200',
    muted: 'bg-muted text-muted-foreground hover:bg-muted',
};

const STATUS_TONE: Record<string, keyof typeof tone> = {
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
    scheduled: 'info',
    running: 'info',
    overdue: 'danger',
    failed: 'danger',
    rejected: 'danger',
    suspended: 'danger',
    cancelled: 'muted',
    revoked: 'muted',
    received_status: 'info',
    paused: 'muted',
};

const LABELS: Record<string, string> = {
    pending_shipment: 'Pending shipment',
    past_due: 'Past due',
};

function humanize(s: string) {
    return LABELS[s] ?? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
    const t = STATUS_TONE[status] ?? 'muted';
    return (
        <Badge className={cn('rounded-md font-medium', tone[t], className)} variant="secondary">
            {humanize(status)}
        </Badge>
    );
}
