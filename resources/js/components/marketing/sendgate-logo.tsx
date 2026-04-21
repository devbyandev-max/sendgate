import { cn } from '@/lib/utils';

export function SendGateLogo({ className }: { className?: string }) {
    return (
        <span className={cn('inline-flex items-center gap-2 text-lg font-extrabold tracking-tight', className)}>
            <SendGateMark className="size-7" />
            <span>
                Send<span className="text-primary">Gate</span>
            </span>
        </span>
    );
}

export function SendGateMark({ className }: { className?: string }) {
    return (
        <img
            src="/logo.png"
            alt="SendGate"
            width="32"
            height="32"
            className={cn('size-6 shrink-0 select-none', className)}
            draggable={false}
        />
    );
}
