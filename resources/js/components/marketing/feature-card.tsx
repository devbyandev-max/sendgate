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
                'group relative overflow-hidden rounded-lg border border-border bg-card p-5',
                'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]',
                'transition-all duration-200 hover:border-primary/30 hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.06),0_4px_12px_-4px_rgb(16_185_129/0.15)]',
                className,
            )}
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-lg bg-gradient-to-b from-primary/0 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/10 group-hover:opacity-100" />

            <div className="flex size-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="size-4" strokeWidth={2.25} />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}
