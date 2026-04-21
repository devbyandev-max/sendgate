import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type CodeSample = { label: string; language: string; code: string };

export function CodeTabs({ samples, className }: { samples: CodeSample[]; className?: string }) {
    const [copied, setCopied] = useState<string | null>(null);

    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm',
                className,
            )}
        >
            <Tabs defaultValue={samples[0]?.label} className="gap-0">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-2 pt-2">
                    <TabsList className="h-auto bg-transparent p-0">
                        {samples.map((sample) => (
                            <TabsTrigger
                                key={sample.label}
                                value={sample.label}
                                className="rounded-t-md rounded-b-none px-3 py-2 text-xs font-medium text-zinc-400 data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none"
                            >
                                {sample.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {samples.map((sample) => (
                    <TabsContent key={sample.label} value={sample.label} className="relative m-0 p-0">
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(sample.code);
                                setCopied(sample.label);
                                setTimeout(() => setCopied(null), 1400);
                            }}
                            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
                        >
                            {copied === sample.label ? (
                                <>
                                    <Check className="size-3" /> Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="size-3" /> Copy
                                </>
                            )}
                        </button>
                        <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                            <code className="font-mono">{sample.code}</code>
                        </pre>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
