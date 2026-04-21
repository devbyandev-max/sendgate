import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export function FeatureCard({
    icon: Icon,
    title,
    description,
    className,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md',
                className,
            )}
        >
            <div className="flex size-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-transform group-hover:scale-105 dark:bg-brand-900/30 dark:text-brand-300">
                <Icon className="size-5" strokeWidth={2.25} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}
