import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    [
        'inline-flex items-center justify-center gap-1',
        'rounded-md px-1.5 py-0.5',
        'text-[11px] font-medium tracking-wide leading-none',
        'border border-transparent',
        'w-fit shrink-0 whitespace-nowrap',
        '[&>svg]:size-3 [&>svg]:pointer-events-none',
        'transition-[color,background-color,border-color]',
    ].join(' '),
    {
        variants: {
            variant: {
                default: 'bg-primary/15 text-primary border-primary/25',
                secondary: 'bg-muted text-foreground border-border',
                outline: 'bg-transparent text-foreground border-border hover:bg-muted',
                destructive: 'bg-destructive/15 text-destructive border-destructive/30',
                success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
                warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
                info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
                muted: 'bg-muted text-muted-foreground border-border',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
