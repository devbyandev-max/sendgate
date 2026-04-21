import { cn } from '@/lib/utils';

export function SectionHeading({
    eyebrow,
    title,
    description,
    className,
    align = 'center',
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
    align?: 'center' | 'left';
}) {
    return (
        <div
            className={cn(
                'max-w-2xl',
                align === 'center' ? 'mx-auto text-center' : 'text-left',
                className,
            )}
        >
            {eyebrow && (
                <div
                    className={cn(
                        'text-xs font-semibold uppercase tracking-[0.2em] text-primary',
                        align === 'center' && 'mx-auto',
                    )}
                >
                    {eyebrow}
                </div>
            )}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
        </div>
    );
}
