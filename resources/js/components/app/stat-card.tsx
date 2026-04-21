import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

import { Sparkline } from '@/components/ui/sparkline';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<Tone, string> = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-red-500/15 text-red-400',
    info: 'bg-blue-500/15 text-blue-400',
};

const sparkTone: Record<Tone, Parameters<typeof Sparkline>[0]['tone']> = {
    default: 'muted',
    success: 'primary',
    warning: 'warning',
    danger: 'destructive',
    info: 'info',
};

export function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    accent = 'default',
    trend,
    sparkline,
    className,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon?: LucideIcon;
    accent?: Tone;
    /** Number between -1 and 1-ish — positive = up, negative = down */
    trend?: number;
    /** Last N data points for the sparkline */
    sparkline?: number[];
    className?: string;
}) {
    const trendUp = typeof trend === 'number' && trend > 0;
    const trendDown = typeof trend === 'number' && trend < 0;

    return (
        <div
            className={cn(
                'relative rounded-lg border border-border bg-card p-4',
                'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]',
                'transition-colors hover:border-border-strong',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                            {label}
                        </p>
                        {typeof trend === 'number' && (
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-semibold',
                                    trendUp && 'bg-emerald-500/15 text-emerald-400',
                                    trendDown && 'bg-red-500/15 text-red-400',
                                    !trendUp && !trendDown && 'bg-muted text-muted-foreground',
                                )}
                            >
                                {trendUp && <ArrowUpRight className="size-2.5" />}
                                {trendDown && <ArrowDownRight className="size-2.5" />}
                                {Math.abs(Math.round(trend * 100))}%
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                        {value}
                    </p>

                    {sub && (
                        <p className="mt-1.5 text-[11px] text-muted-foreground">{sub}</p>
                    )}
                </div>

                {Icon && (
                    <div className={cn('flex size-8 items-center justify-center rounded-md', toneClasses[accent])}>
                        <Icon className="size-4" strokeWidth={2.25} />
                    </div>
                )}
            </div>

            {sparkline && sparkline.length > 1 && (
                <div className="mt-3 flex justify-end">
                    <Sparkline data={sparkline} tone={sparkTone[accent]} width={100} height={28} />
                </div>
            )}
        </div>
    );
}
