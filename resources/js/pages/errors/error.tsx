import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { SendGateMark } from '@/components/marketing/sendgate-logo';
import { Button } from '@/components/ui/button';

const messages: Record<number, { title: string; description: string }> = {
    404: { title: 'Page not found', description: 'The page you’re looking for doesn’t exist or has been moved.' },
    403: { title: 'Forbidden', description: 'You don’t have access to this area.' },
    419: { title: 'Page expired', description: 'Your session has expired. Please refresh and try again.' },
    500: { title: 'Server error', description: 'Something went wrong on our end. We’ve been notified.' },
    503: { title: 'Service unavailable', description: 'SendGate is temporarily down for maintenance.' },
};

export default function ErrorPage({ status }: { status: number }) {
    const m = messages[status] ?? { title: `Error ${status}`, description: 'An unexpected error occurred.' };

    return (
        <>
            <Head title={`${status} — ${m.title}`} />
            <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-16 text-center">
                <Link href="/" className="mb-8">
                    <SendGateMark className="size-10" />
                </Link>
                <p className="font-mono text-sm font-semibold tracking-wider text-primary">{status}</p>
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{m.title}</h1>
                <p className="mt-3 max-w-md text-muted-foreground">{m.description}</p>
                <Button asChild className="mt-8">
                    <Link href="/">
                        <ArrowLeft className="mr-2 size-4" /> Back to home
                    </Link>
                </Button>
            </div>
        </>
    );
}
