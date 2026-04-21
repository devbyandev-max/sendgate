import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    Code2,
    FileSpreadsheet,
    Inbox,
    KeyRound,
    Layers,
    ListChecks,
    Radio,
    Send,
    ShieldCheck,
    Webhook,
} from 'lucide-react';

import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';
import { Button } from '@/components/ui/button';

const sections = [
    {
        title: 'Send SMS',
        description: 'One-off messages, bulk campaigns, scheduled sends — all from one composer.',
        features: [
            { icon: Send, title: 'Single send', description: 'Pick a SIM, type a message, hit send. Live segment counter tells you exactly how many SMS it will split into.' },
            { icon: FileSpreadsheet, title: 'Bulk CSV', description: 'Upload a list, map columns, drop in {{variables}}, preview the render, send.' },
            { icon: ListChecks, title: 'Campaigns', description: 'Multi-step workflow: recipients → message → schedule → review. Live progress and per-recipient delivery tracking.' },
        ],
    },
    {
        title: 'Receive SMS',
        description: 'A real inbox — not a paid add-on. Customers can reply, and you can reply back.',
        features: [
            { icon: Inbox, title: 'Unified inbox', description: 'All inbound SMS across your SIMs in one stream. Filter by SIM, search, star, reply inline.' },
            { icon: Webhook, title: 'Webhooks', description: 'Fire your own endpoints on inbound, delivery, failure. HMAC-signed payloads.' },
            { icon: AlertCircle, title: 'Keyword automation', description: 'STOP, START, HELP handled automatically per NTC guidance. Custom keywords in roadmap.' },
        ],
    },
    {
        title: 'Developers',
        description: 'A clean API, proper docs, predictable errors.',
        features: [
            { icon: Code2, title: 'REST API', description: 'JSON in, JSON out. Same endpoint shapes you already know from Twilio and Vonage.' },
            { icon: KeyRound, title: 'API keys', description: 'Scoped keys with key prefix display and one-time full reveal. Revoke anytime.' },
            { icon: Layers, title: 'SDKs (soon)', description: 'First-party PHP, Node, Python libraries on our roadmap. Community SDKs welcome.' },
        ],
    },
    {
        title: 'Ops & insight',
        description: 'The boring essentials, executed well.',
        features: [
            { icon: BarChart3, title: 'Analytics', description: 'Messages over time, delivery rates, top destinations, peak-hour heatmap.' },
            { icon: Radio, title: 'SIM health', description: 'Per-SIM throughput, last-seen, error-rate trends. Spot blocklisting early.' },
            { icon: ShieldCheck, title: 'Activity logs', description: 'Every sensitive action logged, searchable, and exportable — for audit and compliance.' },
        ],
    },
];

export default function MarketingFeatures() {
    return (
        <>
            <Head title="Features">
                <meta name="description" content="Everything SendGate does — send, receive, API, bulk campaigns, analytics, and ops tooling." />
            </Head>

            <section className="bg-gradient-to-b from-brand-500/5 via-transparent to-transparent">
                <div className="mx-auto max-w-4xl px-4 pb-12 pt-20 text-center sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Features"
                        title="Premium SMS infrastructure, boringly reliable"
                        description="Every feature we ship is designed to make your 10,000th message as fast and predictable as your first."
                    />
                </div>
            </section>

            {sections.map((section, i) => (
                <section key={section.title} className={i % 2 === 0 ? 'py-16' : 'bg-muted/30 py-16'}>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading eyebrow={section.title} title={section.description} align="left" />
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {section.features.map((feature) => (
                                <FeatureCard key={feature.title} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            <section className="py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-bold tracking-tight">The best way to evaluate SendGate is to use it.</h3>
                    <p className="mt-3 text-muted-foreground">Free to browse the dashboard. Ship a SIM when you're ready.</p>
                    <Button asChild size="lg" className="mt-6 shadow-md">
                        <Link href="/register">
                            Sign up free
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
