import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Code2,
    Gauge,
    MessageSquare,
    Radio,
    ShieldCheck,
    Sparkles,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';

import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
    {
        icon: Radio,
        title: 'Bring your own SIM',
        description:
            'Use your Globe, Smart, or DITO SIM. Your number, your load plan, our hardware gateway — you keep full control of identity and deliverability.',
    },
    {
        icon: Wallet,
        title: 'Flat monthly pricing',
        description:
            '₱1,499 per SIM, per month. No per-message fees, no credits to top up, no surprise invoices when you go viral.',
    },
    {
        icon: Code2,
        title: 'Developer-first API',
        description:
            'Clean REST API, SMPP, and webhooks. Send your first SMS in under two minutes. TypeScript-friendly documentation.',
    },
    {
        icon: MessageSquare,
        title: 'Send & receive',
        description:
            'True two-way SMS. Customer replies hit your inbox or fire a webhook instantly — perfect for OTPs, support, and conversational flows.',
    },
    {
        icon: Users,
        title: 'Bulk campaigns',
        description:
            'Import contacts via CSV, drop in {{variables}}, schedule sends, and track delivery per recipient.',
    },
    {
        icon: ShieldCheck,
        title: '99.5% uptime SLA',
        description:
            'Hardware monitored 24/7 with automatic failover between gateway units. Real humans on support in Manila time.',
    },
];

const faqItems = [
    {
        q: 'What exactly is BYOSIM?',
        a: 'Bring Your Own SIM. You ship us your active Globe, Smart, or DITO SIM, we host it in our enterprise-grade hardware gateway in a data center, and you send and receive SMS from that number via our dashboard or API — as if your SIM were in your pocket, but cloud-native.',
    },
    {
        q: 'How do I send my SIM to you?',
        a: 'After signup we email you a prepaid shipping label. Drop the SIM at any LBC, Ninja Van, or J&T branch. Once we receive it, we test, activate, and notify you the same business day. Typical end-to-end onboarding is 2–3 days.',
    },
    {
        q: 'Which SIMs are supported?',
        a: 'All active Philippine SIMs from Globe, Smart/TNT, and DITO. Prepaid and postpaid both work. We recommend an unlimited-text promo for bulk workloads — we can advise during onboarding.',
    },
    {
        q: 'Is there a contract or lock-in?',
        a: 'No. Month-to-month. Cancel anytime from the billing page and we ship your SIM back at our cost within 3 business days.',
    },
    {
        q: 'Can I send marketing SMS?',
        a: 'Yes, provided the recipient has consented and your content complies with the NTC and the Data Privacy Act. We include basic opt-out management and require a STOP keyword on all campaigns by default.',
    },
    {
        q: 'What happens if my SIM gets blocked?',
        a: 'We monitor delivery rates continuously. If a carrier flags your SIM for suspicious throughput we pause sending, notify you, and help remediate. Blocked SIMs are the customer’s responsibility, but we share best practices to avoid it.',
    },
    {
        q: 'How do I pay?',
        a: 'Monthly via bank transfer (BDO, BPI, UnionBank) or GCash. Upload your payment proof in the dashboard — we reconcile within one business day.',
    },
    {
        q: 'Can I cancel anytime?',
        a: 'Yes. There are no cancellation fees and no minimum term. Service continues until the end of your paid billing period.',
    },
    {
        q: 'Do you offer volume discounts?',
        a: 'Starting at 10 SIMs or 100,000 SMS/month we offer custom pricing. Contact support@sendgate.ph with your expected volume.',
    },
    {
        q: 'What’s the throughput limit?',
        a: 'Roughly 8–12 SMS per second per SIM depending on carrier and segment length. Multi-SIM setups scale linearly — combine 5 SIMs for ~50 SMS/s.',
    },
];

const competitorCost = (smsPerMonth: number, provider: 'sendgate' | 'semaphore' | 'infotxt' | 'philsms') => {
    const rates: Record<'semaphore' | 'infotxt' | 'philsms', number> = {
        semaphore: 0.5,
        infotxt: 0.45,
        philsms: 0.5,
    };
    if (provider === 'sendgate') return 1499;
    return Math.round(smsPerMonth * rates[provider]);
};

const peso = (amount: number) => `₱${amount.toLocaleString('en-PH')}`;

export default function MarketingHome() {
    const volumeTiers = [3000, 5000, 10000, 20000, 50000];

    return (
        <>
            <Head title="SMS Gateway for Businesses That Send a Lot">
                <meta
                    name="description"
                    content="Bring your own SIM. Send unlimited SMS from your own Philippine mobile number for one flat rate — ₱1,499/month per SIM."
                />
            </Head>

            <Hero />

            {/* Social proof strip */}
            <section className="border-y border-border/60 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Trusted by businesses sending 10,000+ SMS a month
                    </p>
                    <div className="mt-6 grid grid-cols-2 items-center gap-6 text-center text-sm font-semibold text-muted-foreground/70 sm:grid-cols-3 lg:grid-cols-6">
                        <span>BrightBank PH</span>
                        <span>Jollivery</span>
                        <span>MNLX Logistics</span>
                        <span>EduPlus</span>
                        <span>HomeCare+</span>
                        <span>Rideshare.ph</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Everything you need"
                        title="The SMS platform your engineers will actually enjoy"
                        description="A calm, modern dashboard for your operations team. A clean API for your developers. One flat price for your CFO."
                    />
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="bg-muted/30 py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Pricing that scales with you"
                        title="Cheaper than the competition above 3,000 SMS/month"
                        description="Our flat monthly rate beats per-message pricing the moment you start sending at scale."
                    />
                    <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Monthly volume</th>
                                        <th className="px-4 py-3 text-right text-primary">SendGate</th>
                                        <th className="px-4 py-3 text-right">Semaphore</th>
                                        <th className="px-4 py-3 text-right">InfoTxt</th>
                                        <th className="px-4 py-3 text-right">PhilSMS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {volumeTiers.map((vol) => (
                                        <tr key={vol} className="hover:bg-muted/40">
                                            <td className="px-4 py-3 font-medium">{vol.toLocaleString('en-PH')} SMS</td>
                                            <td className="bg-brand-50 px-4 py-3 text-right font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
                                                {peso(competitorCost(vol, 'sendgate'))}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {peso(competitorCost(vol, 'semaphore'))}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {peso(competitorCost(vol, 'infotxt'))}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {peso(competitorCost(vol, 'philsms'))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                            Competitor rates estimated from public pricing. SendGate cost is flat per SIM regardless of
                            volume; scale horizontally by adding SIMs for more throughput.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <PricingBlock />

            {/* FAQ */}
            <section className="py-24" id="faq">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Everything you wanted to ask"
                        description="Can’t find what you need? Email support@sendgate.ph and we’ll get back to you within one business day."
                    />
                    <Accordion type="single" collapsible className="mt-12 divide-y divide-border rounded-xl border border-border bg-card px-6">
                        {faqItems.map((item) => (
                            <AccordionItem key={item.q} value={item.q}>
                                <AccordionTrigger>{item.q}</AccordionTrigger>
                                <AccordionContent>{item.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-500/5" />
                <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Start sending smarter SMS today.
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Ship your SIM this week. Send from it tomorrow.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild size="lg" className="shadow-md">
                            <Link href="/register">
                                Create your account
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/docs">Read the docs</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-500/5" />
            <div
                className="absolute inset-0 -z-10 opacity-[0.35]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 25% 10%, rgba(16,185,129,0.25), transparent 40%), radial-gradient(circle at 80% 80%, rgba(4,120,87,0.2), transparent 45%)',
                }}
            />
            <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-grid-emerald opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
                <div className="flex flex-col justify-center">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <Sparkles className="size-3.5 text-primary" />
                        <span>Built for the Philippines 🇵🇭</span>
                    </div>
                    <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                        SMS gateway for businesses that <span className="text-primary">send a lot</span>.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Bring your own SIM. Pay one flat rate. Send unlimited SMS from your own Philippine mobile
                        number — from a REST API, a CSV upload, or a dashboard your ops team will enjoy opening.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild size="lg" className="shadow-md">
                            <Link href="/register">
                                Get started — ₱1,499/mo
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/docs">View documentation →</Link>
                        </Button>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <Tick>No per-message fees</Tick>
                        <Tick>No contracts</Tick>
                        <Tick>Setup in 2–3 days</Tick>
                    </div>
                </div>

                <HeroPreviewCard />
            </div>
        </section>
    );
}

function Tick({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-primary" />
            {children}
        </span>
    );
}

function HeroPreviewCard() {
    const messages = [
        { to: '+63917 123 4567', body: 'Your OTP is 482913. Valid for 5 minutes.', status: 'Delivered', ms: '0.9s' },
        { to: '+63927 988 2210', body: 'Order #8821 out for delivery — ETA 2:45 PM.', status: 'Delivered', ms: '0.7s' },
        { to: '+63998 554 1122', body: 'Reminder: appointment at Clinic tomorrow 10am.', status: 'Delivered', ms: '1.1s' },
        { to: '+63917 332 7001', body: 'Thanks! Reply YES to confirm your order.', status: 'Delivered', ms: '0.6s' },
    ];

    return (
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-10 top-10 -z-10 h-full rounded-3xl bg-brand-500/10 blur-3xl" />
            <div className="relative w-full max-w-md rotate-[-1deg] rounded-2xl border border-border bg-card p-4 shadow-xl">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <div className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-red-400" />
                        <span className="size-2.5 rounded-full bg-amber-400" />
                        <span className="size-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="ml-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Gauge className="size-3.5" />
                        Live dashboard
                    </div>
                    <div className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                        <span className="size-1.5 rounded-full bg-brand-500 motion-safe:animate-pulse" /> Active
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors',
                                'hover:border-border hover:bg-muted/30',
                            )}
                        >
                            <div className="flex size-8 flex-none items-center justify-center rounded-md bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                                <Zap className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-xs font-semibold text-foreground">{m.to}</span>
                                    <span className="ml-auto text-[10px] text-muted-foreground">{m.ms}</span>
                                </div>
                                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{m.body}</p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                {m.status}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
                    <span>SIM #1 · Globe · +63917 123 0001</span>
                    <span className="font-mono">4.3 SMS/s</span>
                </div>
            </div>
        </div>
    );
}

function PricingBlock() {
    const included = [
        'Unlimited outbound SMS from your SIM',
        'Unlimited inbound SMS',
        'REST API + webhooks',
        'Bulk campaigns with CSV import',
        'Full dashboard + analytics',
        'Two-way conversations',
        '99.5% uptime SLA',
    ];
    return (
        <section className="py-24" id="pricing">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="One plan. No gotchas."
                    title="One flat price per SIM. Scale by adding SIMs."
                />
                <div className="relative mt-14 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-md">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400" />
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                SendGate Standard
                            </div>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold tracking-tight text-foreground">₱1,499</span>
                                <span className="text-sm font-semibold text-muted-foreground">/ SIM / month</span>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Month-to-month. Cancel anytime. Your SIM, your number, your rules.
                            </p>
                        </div>
                        <Button asChild size="lg" className="shadow-md">
                            <Link href="/register">Get started</Link>
                        </Button>
                    </div>

                    <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                        {included.map((line) => (
                            <div key={line} className="flex items-start gap-2 text-sm text-foreground">
                                <CheckCircle2 className="mt-0.5 size-4 flex-none text-primary" />
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
