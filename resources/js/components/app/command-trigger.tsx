import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

/**
 * Command-bar trigger. Fires `⌘K / Ctrl+K` to open a search dialog. For now
 * the dialog is a lightweight placeholder — wire up real search later.
 */
export function CommandTrigger({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((v) => !v);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'group inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-subtle px-2.5 text-sm text-muted-foreground',
                    'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.03)]',
                    'hover:border-border-strong hover:text-foreground transition-colors',
                    'w-60 max-w-full',
                    className,
                )}
            >
                <Search className="size-3.5" />
                <span className="flex-1 text-left">Search…</span>
                <Kbd>⌘K</Kbd>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-24"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-lg border border-border bg-popover shadow-xl animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                            <Search className="size-4 text-muted-foreground" />
                            <input
                                autoFocus
                                placeholder="Type a command or search…"
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                            <Kbd>Esc</Kbd>
                        </div>
                        <div className="p-2">
                            <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Suggestions
                            </div>
                            <div className="space-y-0.5">
                                {[
                                    'Send SMS',
                                    'View inbox',
                                    'Add contact',
                                    'Generate API key',
                                    'View invoices',
                                    'Go to dashboard',
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent"
                                    >
                                        <span>{item}</span>
                                        <span className="text-xs text-muted-foreground">{isMac ? '⌘' : 'Ctrl'}↵</span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-border px-2 pt-2 text-[11px] text-muted-foreground">
                                <span>Command palette</span>
                                <span>Real search wiring coming soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
