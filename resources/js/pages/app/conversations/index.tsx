import { Head, router } from '@inertiajs/react';
import { MessagesSquare, Phone, Radio } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { ChatComposer } from '@/components/app/chat/chat-composer';
import { ConversationList, type ConversationListItem } from '@/components/app/chat/conversation-list';
import { MessageBubble, type ThreadMessage } from '@/components/app/chat/message-bubble';
import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Sim = { id: number; phone_number: string; label: string | null; carrier: string };

type ActiveConversation = {
    thread: string;
    sim_id: number;
    remote_number: string;
    sim_phone: string | null;
    sim_carrier: string | null;
    sim_label: string | null;
};

type PageProps = {
    conversations: ConversationListItem[];
    active_thread: string | null;
    active_conversation: ActiveConversation | null;
    messages: ThreadMessage[];
    sims: Sim[];
};

export default function ConversationsIndex({
    conversations,
    active_thread,
    active_conversation,
    messages,
    sims,
}: PageProps) {
    const threadRef = useRef<HTMLDivElement>(null);
    const [showNewComposer, setShowNewComposer] = useState(false);

    // Auto-scroll to bottom when thread changes or new messages arrive
    useEffect(() => {
        const el = threadRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [active_thread, messages.length]);

    // Group consecutive messages from same sender within 5 minutes for tighter visual clustering
    const grouped = useMemo(() => {
        const groups: ThreadMessage[][] = [];
        for (const m of messages) {
            const last = groups[groups.length - 1];
            const lastMsg = last?.[last.length - 1];
            if (
                lastMsg &&
                lastMsg.direction === m.direction &&
                new Date(m.created_at).getTime() - new Date(lastMsg.created_at).getTime() < 5 * 60 * 1000
            ) {
                last!.push(m);
            } else {
                groups.push([m]);
            }
        }
        return groups;
    }, [messages]);

    const dayLabel = (iso: string) => {
        const d = new Date(iso);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    // Per-day separator positions
    const withSeparators = useMemo(() => {
        const items: Array<{ type: 'day'; label: string; key: string } | { type: 'group'; messages: ThreadMessage[] }> = [];
        let lastDay = '';
        for (const group of grouped) {
            const day = dayLabel(group[0].created_at);
            if (day !== lastDay) {
                items.push({ type: 'day', label: day, key: day + group[0].id });
                lastDay = day;
            }
            items.push({ type: 'group', messages: group });
        }
        return items;
    }, [grouped]);

    return (
        <>
            <Head title={active_conversation ? active_conversation.remote_number : 'Conversations'} />

            <div className="space-y-4">
                <PageHeader
                    title="Conversations"
                    description="Two-way SMS threads grouped by SIM and contact."
                    actions={
                        <Button size="sm" onClick={() => setShowNewComposer((v) => !v)}>
                            <MessagesSquare className="size-3.5" />
                            New conversation
                        </Button>
                    }
                    className="mb-0"
                />

                {/* New-conversation composer (slides in) */}
                {showNewComposer && (
                    <div className="border-b border-border bg-surface-subtle/50 px-4 py-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Start a new conversation
                        </p>
                        <ChatComposer
                            sims={sims}
                            onSent={() => setShowNewComposer(false)}
                        />
                    </div>
                )}

                {/* Main: list + thread split pane */}
                <div className="grid h-[calc(100vh-14rem)] grid-cols-1 overflow-hidden rounded-lg border border-border bg-background md:grid-cols-[320px_1fr]">
                    {/* Conversation list */}
                    <aside className="hidden min-h-0 border-r border-border bg-surface-subtle/40 md:flex md:flex-col">
                        <ConversationList items={conversations} activeThread={active_thread} />
                    </aside>

                    {/* Thread */}
                    <section className="flex min-h-0 flex-col">
                        {active_conversation ? (
                            <ActiveThread
                                conversation={active_conversation}
                                messages={withSeparators}
                                threadRef={threadRef}
                                sims={sims}
                            />
                        ) : conversations.length > 0 ? (
                            <div className="flex flex-1 items-center justify-center p-8">
                                <EmptyState
                                    icon={MessagesSquare}
                                    title="Select a conversation"
                                    description="Pick a thread from the list to read it, or start a new conversation."
                                />
                            </div>
                        ) : (
                            <div className="flex flex-1 items-center justify-center p-8">
                                <EmptyState
                                    icon={MessagesSquare}
                                    title="No conversations yet"
                                    description="Send or receive an SMS and it'll show up here. Every SIM + phone-number pair gets its own thread."
                                    action={
                                        <Button onClick={() => setShowNewComposer(true)}>
                                            <MessagesSquare className="size-3.5" />
                                            Start one
                                        </Button>
                                    }
                                />
                            </div>
                        )}
                    </section>
                </div>

                {/* Mobile hint: list + thread stacked */}
                {active_conversation && (
                    <div className="md:hidden">
                        <button
                            onClick={() => router.get('/app/conversations')}
                            className="mt-2 text-xs text-primary hover:underline"
                        >
                            ← All conversations
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function ActiveThread({
    conversation,
    messages,
    threadRef,
    sims,
}: {
    conversation: ActiveConversation;
    messages: Array<{ type: 'day'; label: string; key: string } | { type: 'group'; messages: ThreadMessage[] }>;
    threadRef: React.RefObject<HTMLDivElement | null>;
    sims: Sim[];
}) {
    return (
        <>
            {/* Thread header */}
            <header className="flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
                <div className="flex size-9 items-center justify-center rounded-full border border-border bg-surface-subtle font-mono text-[11px] text-muted-foreground">
                    {conversation.remote_number.replace(/[^\d]/g, '').slice(-2) || '··'}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate font-mono text-sm font-semibold tabular-nums">
                        {conversation.remote_number}
                    </h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Radio className="size-3" />
                        via {conversation.sim_phone ?? 'SIM'}
                        {conversation.sim_label && (
                            <>
                                <span className="opacity-40">·</span>
                                <span>{conversation.sim_label}</span>
                            </>
                        )}
                        <span className="opacity-40">·</span>
                        <span>{conversation.sim_carrier?.toUpperCase() ?? 'Unknown carrier'}</span>
                    </p>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="Call">
                    <Phone className="size-4" />
                </Button>
            </header>

            {/* Scrollable message list */}
            <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mx-auto max-w-2xl space-y-3">
                    {messages.map((item, i) => (
                        <Fragment key={item.type === 'day' ? item.key : `g-${i}`}>
                            {item.type === 'day' && <DaySeparator label={item.label} />}
                            {item.type === 'group' && (
                                <div className="space-y-1">
                                    {item.messages.map((m) => (
                                        <MessageBubble key={m.id} message={m} />
                                    ))}
                                </div>
                            )}
                        </Fragment>
                    ))}

                    {/* Show the latest status inline under the last group */}
                    {messages.length > 0 && (
                        <LastMessageHint messages={messages} />
                    )}
                </div>
            </div>

            {/* Composer */}
            <ChatComposer
                sims={sims}
                defaultSimId={conversation.sim_id.toString()}
                defaultTo={conversation.remote_number}
                lockRecipient
            />
        </>
    );
}

function DaySeparator({ label }: { label: string }) {
    return (
        <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
            <span className="relative rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
        </div>
    );
}

function LastMessageHint({
    messages,
}: {
    messages: Array<{ type: 'day'; label: string; key: string } | { type: 'group'; messages: ThreadMessage[] }>;
}) {
    // Find last message across all groups
    let last: ThreadMessage | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
        const item = messages[i];
        if (item.type === 'group') {
            last = item.messages[item.messages.length - 1];
            break;
        }
    }
    if (!last || last.direction !== 'outbound') return null;

    return (
        <div className={cn('flex justify-end px-1')}>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <StatusBadge status={last.status} />
                {last.status === 'delivered' && last.delivered_at && (
                    <span className="tabular-nums">
                        {new Date(last.delivered_at).toLocaleTimeString('en-PH', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </span>
                )}
            </div>
        </div>
    );
}
