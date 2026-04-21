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
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-6', className)}
            aria-hidden="true"
        >
            <rect width="32" height="32" rx="8" fill="url(#sg-bg)" />
            <path
                d="M9.2 15.1 21 9l-3.4 6.6 4.2 1.2-10.3 7.2L14.8 18l-5.6-2.9Z"
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.6"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="sg-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" />
                    <stop offset="1" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
    );
}
