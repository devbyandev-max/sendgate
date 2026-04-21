import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';

import { SectionHeading } from '@/components/marketing/section-heading';
import { Button } from '@/components/ui/button';

const features = [
    { label: 'Outbound SMS', sendgate: 'Unlimited', competitor: 'Per message' },
    { label: 'Inbound SMS', sendgate: 'Unlimited', competitor: 'Varies / not supported' },
    { label: 'Dedicated phone number', sendgate: 'Yes — your own SIM', competitor: 'Shared sender IDs' },
    { label: 'API', sendgate: 'REST + SMPP + webhooks', competitor: 'REST only' },
    { label: 'Delivery receipts', sendgate: 'Included', competitor: 'Paid add-on' },
    { label: 'Bulk CSV upload', sendgate: 'Included', competitor: 'Included' },
    { label: 'Two-way conversations', sendgate: true, competitor: false },
    { label: 'Setup fee', sendgate: '₱0', competitor: 'Varies' },
    { label: 'Minimum contract', sendgate: 'None', competitor: 'Usually 6–12 months' },
];

export default function MarketingPricing() {
    return (
        <>
            <Head title="Pricing — ₱1,499 per SIM per month">
                <meta name="description" content="Simple flat monthly pricing: ₱1,499 per SIM per month. No per-message fees. No contracts." />
            </Head>

            <section className="bg-gradient-to-b from-brand-500/5 via-transparent to-transparent">
                <div className="mx-auto max-w-5xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Pricing"
                        title="One flat price. Unlimited SMS."
                        description="₱1,499 per SIM per month. No credits. No per-message fees. No contract. Scale by adding SIMs."
                    />
                </div>
            </section>

            <section className="pb-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Starter */}
                        <PlanCard
                            name="Starter"
                            price="₱1,499"
                            period="/ SIM / month"
                            description="Perfect for single-SIM workloads — OTPs, notifications, customer support."
                            features={[
                                'Unlimited SMS on your SIM',
                                'REST API + webhooks',
                                'Dashboard + analytics',
                                'Email support',
                                '99.5% uptime SLA',
                            ]}
                            cta="Start with 1 SIM"
                        />
                        {/* Growth (recommended) */}
                        <PlanCard
                            name="Growth"
                            price="₱5,999"
                            period="/ month (bundle of 5 SIMs)"
                            description="Most popular. Scale throughput with redundancy for busy peaks."
                            features={[
                                '5 SIMs pooled for throughput',
                                'Priority support',
                                '~40 SMS/sec combined throughput',
                                'Campaigns, scheduling, contacts',
                                'Round-robin SIM routing',
                            ]}
                            cta="Get Growth"
                            highlighted
                        />
                        {/* Enterprise */}
                        <PlanCard
                            name="Enterprise"
                            price="Custom"
                            period=""
                            description="For 10+ SIMs or 100k+ SMS/month. Includes SMPP, SSO, and a dedicated account manager."
                            features={[
                                '10+ SIMs with volume pricing',
                                'SMPP access',
                                'Custom SLA + phone support',
                                'SSO / SCIM (coming soon)',
                                'Onboarding assistance',
                            ]}
                            cta="Contact sales"
                        />
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="bg-muted/30 py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Apples to apples" title="How SendGate compares" />
                    <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">Feature</th>
                                    <th className="px-4 py-3 text-left text-primary">SendGate</th>
                                    <th className="px-4 py-3 text-left">Typical SMS API</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {features.map((row) => (
                                    <tr key={row.label} className="hover:bg-muted/40">
                                        <td className="px-4 py-3 font-medium">{row.label}</td>
                                        <td className="px-4 py-3 text-brand-700 dark:text-brand-300">
                                            {typeof row.sendgate === 'boolean' ? (
                                                row.sendgate ? <CheckCircle2 className="size-4 text-primary" /> : <XCircle className="size-4 text-muted-foreground" />
                                            ) : (
                                                row.sendgate
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {typeof row.competitor === 'boolean' ? (
                                                row.competitor ? <CheckCircle2 className="size-4 text-primary" /> : <XCircle className="size-4 text-muted-foreground/60" />
                                            ) : (
                                                row.competitor
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-bold tracking-tight">Ready to try it?</h3>
                    <p className="mt-3 text-muted-foreground">Create your account, ship us your SIM, start sending within 72 hours.</p>
                    <Button asChild size="lg" className="mt-6 shadow-md">
                        <Link href="/register">Create your account</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

function PlanCard({
    name,
    price,
    period,
    description,
    features,
    cta,
    highlighted,
}: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
}) {
    return (
        <div
            className={
                'relative flex flex-col rounded-2xl border p-6 transition-all ' +
                (highlighted
                    ? 'border-primary bg-card shadow-lg ring-1 ring-primary/20'
                    : 'border-border bg-card hover:shadow-md')
            }
        >
            {highlighted && (
                <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                    Most popular
                </div>
            )}
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                {period && <span className="text-sm text-muted-foreground">{period}</span>}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{description}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
                {features.map((f) => (
                    <li key={f} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 flex-none text-primary" />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
            <Button asChild variant={highlighted ? 'default' : 'outline'} className="mt-8 w-full">
                <Link href={name === 'Enterprise' ? 'mailto:sales@sendgate.ph' : '/register'}>{cta}</Link>
            </Button>
        </div>
    );
}
