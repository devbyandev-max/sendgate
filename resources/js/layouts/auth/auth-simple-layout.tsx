import { Link } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-emerald opacity-60" />
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-halo-emerald" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-emerald opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    {/* Logo + title cluster */}
                    <div className="flex flex-col items-center gap-5">
                        <Link
                            href={home()}
                            className="group flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
                        >
                            <AppLogoIcon className="size-10" />
                            <span>
                                Send<span className="text-primary">Gate</span>
                            </span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                    </div>

                    {/* Glass card around the form */}
                    <div className="relative rounded-lg border border-border/80 bg-card/80 p-6 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04),0_24px_48px_-24px_rgb(0_0_0/0.5)] backdrop-blur-xl">
                        {/* Top gradient highlight */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        {children}
                    </div>

                    <p className="text-center text-[11px] text-muted-foreground">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-foreground hover:text-primary">Terms</Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-foreground hover:text-primary">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
