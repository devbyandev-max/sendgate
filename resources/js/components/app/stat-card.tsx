import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    accent = 'default',
    className,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon?: LucideIcon;
    accent?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
}) {
    const accentClasses: Record<string, string> = {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <div className={cn('rounded-xl border border-border bg-card p-5 transition hover:shadow-md', className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
                    {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
                </div>
                {Icon && (
                    <div className={cn('flex size-10 items-center justify-center rounded-lg', accentClasses[accent])}>
                        <Icon className="size-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
