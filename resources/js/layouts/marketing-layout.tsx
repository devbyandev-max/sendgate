import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';

import { SendGateLogo } from '@/components/marketing/sendgate-logo';
import { Button } from '@/components/ui/button';
import { useFlashToast } from '@/hooks/use-flash-toast';
import type { SharedData } from '@/types';

type NavLink = { label: string; href: string };

const navLinks: NavLink[] = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'FAQ', href: '/faq' },
];

export default function MarketingLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);
    useFlashToast();

    return (
        <div className="min-h-svh bg-background text-foreground antialiased">
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center">
                        <SendGateLogo />
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {auth?.user ? (
                            <Button asChild>
                                <Link href={auth.user.is_admin ? '/admin/dashboard' : '/app/dashboard'}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button asChild className="shadow-sm">
                                    <Link href="/register">Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </nav>

                {open && (
                    <div className="border-t border-border/60 px-4 py-4 md:hidden">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-4">
                                {auth?.user ? (
                                    <Button asChild className="w-full">
                                        <Link href={auth.user.is_admin ? '/admin/dashboard' : '/app/dashboard'}>Dashboard</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" className="w-full">
                                            <Link href="/login">Log in</Link>
                                        </Button>
                                        <Button asChild className="w-full">
                                            <Link href="/register">Get started</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main id="content" className="relative">
                {children}
            </main>

            <footer className="border-t border-border/60 bg-muted/30">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
                    <div className="lg:col-span-2">
                        <SendGateLogo />
                        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                            Bring your own SIM. Send unlimited SMS from your own Philippine mobile number for one flat monthly rate.
                        </p>
                    </div>
                    <FooterColumn
                        title="Product"
                        links={[
                            { label: 'Features', href: '/features' },
                            { label: 'Pricing', href: '/pricing' },
                            { label: 'Documentation', href: '/docs' },
                            { label: 'FAQ', href: '/faq' },
                        ]}
                    />
                    <FooterColumn
                        title="Company"
                        links={[
                            { label: 'About', href: '/#about' },
                            { label: 'Contact', href: 'mailto:support@sendgate.ph' },
                            { label: 'Status', href: '#' },
                        ]}
                    />
                    <FooterColumn
                        title="Legal"
                        links={[
                            { label: 'Terms', href: '/terms' },
                            { label: 'Privacy', href: '/privacy' },
                            { label: 'Acceptable use', href: '/terms#aup' },
                        ]}
                    />
                </div>
                <div className="border-t border-border/60">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
                        <p>&copy; {new Date().getFullYear()} SendGate Philippines, Inc. All rights reserved.</p>
                        <p>Made in Manila 🇵🇭</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
    return (
        <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
            <ul className="mt-4 space-y-2">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
