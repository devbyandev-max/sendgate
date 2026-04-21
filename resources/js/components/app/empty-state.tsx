import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-subtle/40 px-6 py-16 text-center',
                className,
            )}
        >
            {/* ambient halo */}
            <div className="pointer-events-none absolute inset-0 -z-0 bg-halo-emerald opacity-30" />

            <div className="relative flex size-10 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
                <Icon className="size-5" />
            </div>
            <h3 className="relative mt-4 text-sm font-semibold text-foreground">{title}</h3>
            {description && (
                <p className="relative mt-1 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="relative mt-5">{action}</div>}
        </div>
    );
}
