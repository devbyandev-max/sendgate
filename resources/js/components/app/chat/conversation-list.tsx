import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type ConversationListItem = {
    thread: string;
    sim_id: number;
    remote_number: string;
    last_message: string;
    last_direction: 'outbound' | 'inbound';
    last_status: string;
    last_message_at: string;
    inbound_count: number;
    outbound_count: number;
    unread: boolean;
    sim_phone: string | null;
    sim_carrier: string | null;
    sim_label: string | null;
};

function relativeTime(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export function ConversationList({
    items,
    activeThread,
}: {
    items: ConversationListItem[];
    activeThread: string | null;
}) {
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        if (!q.trim()) return items;
        const needle = q.toLowerCase();
        return items.filter(
            (it) =>
                it.remote_number.toLowerCase().includes(needle) ||
                it.last_message.toLowerCase().includes(needle),
        );
    }, [items, q]);

    return (
        <div className="flex h-full flex-col">
            {/* Search */}
            <div className="relative border-b border-border p-3">
                <Search className="pointer-events-none absolute left-5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search conversations"
                    className="h-8 pl-8 text-xs"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        <p>{q ? 'No matches.' : 'No conversations yet.'}</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border/60">
                        {filtered.map((conv) => {
                            const isActive = activeThread === conv.thread;
                            const initial = conv.remote_number.replace(/[^\d]/g, '').slice(-2);
                            return (
                                <li key={conv.thread}>
                                    <Link
                                        href={`/app/conversations?thread=${encodeURIComponent(conv.thread)}`}
                                        preserveScroll
                                        className={cn(
                                            'relative flex items-start gap-3 px-3 py-3 transition-colors',
                                            isActive
                                                ? 'bg-surface'
                                                : 'hover:bg-surface/60',
                                        )}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-primary" />
                                        )}

                                        {/* Avatar */}
                                        <div
                                            className={cn(
                                                'flex size-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums',
                                                conv.unread
                                                    ? 'border-primary/40 bg-primary/10 text-primary'
                                                    : 'border-border bg-surface-subtle text-muted-foreground',
                                            )}
                                        >
                                            {initial || '··'}
                                        </div>

                                        {/* Main */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p
                                                    className={cn(
                                                        'truncate font-mono text-[12px] tabular-nums',
                                                        conv.unread ? 'font-semibold text-foreground' : 'text-foreground',
                                                    )}
                                                >
                                                    {conv.remote_number}
                                                </p>
                                                <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                                                    {relativeTime(conv.last_message_at)}
                                                </span>
                                            </div>

                                            <p
                                                className={cn(
                                                    'mt-0.5 line-clamp-1 text-[12px]',
                                                    conv.unread ? 'text-foreground' : 'text-muted-foreground',
                                                )}
                                            >
                                                {conv.last_direction === 'outbound' && (
                                                    <span className="text-muted-foreground/60">You: </span>
                                                )}
                                                {conv.last_message}
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground/80">
                                                    via {conv.sim_phone ?? 'SIM'}
                                                </span>
                                                {conv.unread && (
                                                    <span className="ml-auto size-1.5 rounded-full bg-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
