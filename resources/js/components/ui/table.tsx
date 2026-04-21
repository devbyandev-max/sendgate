import * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto">
            <table
                data-slot="table"
                className={cn('w-full caption-bottom text-[13px] tabular-nums', className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <thead
            data-slot="table-header"
            className={cn('bg-surface-subtle/60 backdrop-blur-sm [&_tr]:border-b [&_tr]:border-border', className)}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tbody
            data-slot="table-body"
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('bg-surface-subtle/60 border-t border-border font-medium [&>tr]:last:border-b-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-b border-border/60 transition-colors',
                'hover:bg-muted/40 data-[state=selected]:bg-muted',
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-9 px-3 text-left align-middle whitespace-nowrap',
                'text-[11px] font-medium tracking-wider uppercase text-muted-foreground',
                '[&:has([role=checkbox])]:pr-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                'px-3 py-2.5 align-middle whitespace-nowrap text-foreground',
                '[&:has([role=checkbox])]:pr-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
    return (
        <caption
            data-slot="table-caption"
            className={cn('text-muted-foreground mt-4 text-sm', className)}
            {...props}
        />
    );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
