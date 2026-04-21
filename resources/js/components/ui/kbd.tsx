import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Keyboard shortcut hint — ⌘K, Esc, ↵, etc.
 */
export function Kbd({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <kbd className={cn('kbd', className)} {...props}>
            {children}
        </kbd>
    );
}
