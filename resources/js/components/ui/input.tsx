import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'flex h-9 w-full min-w-0 rounded-md border border-border bg-surface-subtle px-3 py-1 text-sm',
                'shadow-[inset_0_1px_1px_0_rgb(0_0_0/0.10)]',
                'placeholder:text-muted-foreground text-foreground',
                'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                'transition-[color,box-shadow,border-color] duration-150 outline-none',
                'hover:border-border-strong',
                'focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
                'selection:bg-primary/25 selection:text-foreground',
                className,
            )}
            {...props}
        />
    );
}

export { Input };
