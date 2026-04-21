import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    [
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'rounded-md text-sm font-medium',
        'transition-[color,box-shadow,transform,background-color] duration-150',
        'active:scale-[0.985]',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'aria-invalid:ring-destructive/30 aria-invalid:border-destructive',
    ].join(' '),
    {
        variants: {
            variant: {
                // Premium primary — gradient + inset highlight + subtle ring
                default: [
                    'bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_10%)]',
                    'text-primary-foreground font-semibold',
                    'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_1px_2px_0_rgb(0_0_0/0.3)]',
                    'hover:from-[color-mix(in_oklch,var(--primary),white_3%)] hover:to-primary',
                    'hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.22),0_2px_6px_-1px_rgb(16_185_129/0.35)]',
                ].join(' '),

                destructive: [
                    'bg-gradient-to-b from-destructive to-[color-mix(in_oklch,var(--destructive),black_10%)]',
                    'text-white font-semibold',
                    'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.16),0_1px_2px_0_rgb(0_0_0/0.3)]',
                    'hover:from-[color-mix(in_oklch,var(--destructive),white_3%)] hover:to-destructive',
                    'focus-visible:ring-destructive/40',
                ].join(' '),

                // Outlined — subtle surface with border that brightens on hover
                outline: [
                    'border border-border bg-surface text-foreground',
                    'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]',
                    'hover:bg-accent hover:border-border-strong',
                ].join(' '),

                secondary: [
                    'bg-secondary text-secondary-foreground border border-border',
                    'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]',
                    'hover:bg-accent',
                ].join(' '),

                ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',

                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-3.5 py-2 has-[>svg]:px-3 text-sm',
                sm: 'h-8 rounded-md px-3 has-[>svg]:px-2.5 text-xs',
                lg: 'h-10 rounded-md px-5 has-[>svg]:px-4 text-sm',
                xl: 'h-11 rounded-md px-6 has-[>svg]:px-5 text-sm',
                icon: 'size-9',
                'icon-sm': 'size-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
