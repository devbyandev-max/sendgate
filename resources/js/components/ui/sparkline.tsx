import { cn } from '@/lib/utils';

/**
 * Inline SVG sparkline — no external dep. Pass `data` as raw numbers; we scale
 * to fit the box. Tone tints the line + area fill. Designed to live at the
 * bottom-right of a StatCard at 80x24.
 */
export function Sparkline({
    data,
    width = 80,
    height = 24,
    tone = 'primary',
    className,
}: {
    data: number[];
    width?: number;
    height?: number;
    tone?: 'primary' | 'muted' | 'destructive' | 'warning' | 'info';
    className?: string;
}) {
    if (!data || data.length === 0) {
        return null;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const stepX = data.length > 1 ? width / (data.length - 1) : width;

    const points = data.map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * (height - 2) - 1;
        return { x, y };
    });

    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;

    const toneColor: Record<NonNullable<Parameters<typeof Sparkline>[0]['tone']>, string> = {
        primary: 'var(--primary)',
        muted: 'var(--muted-foreground)',
        destructive: 'var(--destructive)',
        warning: 'var(--warning)',
        info: 'var(--info)',
    };

    const color = toneColor[tone];
    const gradientId = `spark-${tone}-${Math.random().toString(36).slice(2, 7)}`;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className={cn('overflow-visible', className)}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gradientId})`} />
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
