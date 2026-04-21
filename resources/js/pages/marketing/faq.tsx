import { Head, Link } from '@inertiajs/react';

import { SectionHeading } from '@/components/marketing/section-heading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const groups = [
    {
        title: 'Onboarding',
        items: [
            { q: 'How does BYOSIM work?', a: 'You register, we email a prepaid shipping label, you drop your active Philippine SIM at LBC / Ninja Van / J&T. We receive it, insert it into our hardware gateway, test the line, and activate your account. End-to-end onboarding: 2–3 business days.' },
            { q: 'What SIMs are supported?', a: 'All active Globe, Smart / TNT, and DITO SIMs — both prepaid and postpaid. An unlimited-text promo is strongly recommended for bulk workloads.' },
            { q: 'Do you ever send physical hardware to me?', a: 'No. Your SIM lives in our gateway. That’s the whole point — we operate the hardware; you get an API.' },
        ],
    },
    {
        title: 'Pricing & billing',
        items: [
            { q: 'Is there a contract?', a: 'No. Month-to-month. Cancel anytime.' },
            { q: 'How do I pay?', a: 'Bank transfer (BDO / BPI / UnionBank) or GCash. Upload your payment proof in the dashboard and we reconcile within one business day.' },
            { q: 'Do you offer volume discounts?', a: 'Yes. 10+ SIMs or 100k+ SMS/month qualify for custom pricing. Email sales@sendgate.ph.' },
            { q: 'Are there setup fees?', a: 'None for Starter and Growth. Enterprise onboarding may include setup based on scope.' },
        ],
    },
    {
        title: 'Sending',
        items: [
            { q: 'Can I send marketing SMS?', a: 'Yes — with proper consent and a STOP opt-out, in line with the Data Privacy Act and NTC guidelines. We enforce opt-out tracking automatically.' },
            { q: 'What’s the throughput limit?', a: 'Roughly 8–12 SMS/sec per SIM, depending on carrier and message length. Scale by adding SIMs.' },
            { q: 'What if a SIM gets blocked?', a: 'We monitor delivery rates and pause sending if we detect carrier blocks. We’ll notify you and coordinate remediation. Blocked SIMs are the customer’s responsibility, but we share every best practice we know to avoid it.' },
            { q: 'Can I send from an alphanumeric sender ID?', a: 'Not today — your sender is the SIM’s phone number. Philippine carriers generally restrict alphanumeric senders.' },
        ],
    },
    {
        title: 'Security & reliability',
        items: [
            { q: 'What uptime do you guarantee?', a: '99.5% monthly uptime SLA. Credits are available for measured breaches.' },
            { q: 'Where is my data hosted?', a: 'Philippines-based data center; standard encryption at rest; TLS everywhere in transit.' },
            { q: 'Do you offer SSO / 2FA?', a: '2FA (TOTP) is available today for every account. SSO / SCIM is on the Enterprise roadmap.' },
        ],
    },
];

export default function MarketingFaq() {
    return (
        <>
            <Head title="Frequently Asked Questions">
                <meta name="description" content="Answers to the most common questions about SendGate, BYOSIM, pricing, and compliance." />
            </Head>

            <section className="bg-gradient-to-b from-brand-500/5 via-transparent to-transparent">
                <div className="mx-auto max-w-3xl px-4 pb-10 pt-20 text-center sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Questions, answered."
                        description="Still need help? Email support@sendgate.ph — we answer within one business day."
                    />
                </div>
            </section>

            <section className="pb-20">
                <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
                    {groups.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {group.title}
                            </h3>
                            <Accordion
                                type="single"
                                collapsible
                                className="mt-3 divide-y divide-border rounded-xl border border-border bg-card px-6"
                            >
                                {group.items.map((item) => (
                                    <AccordionItem key={item.q} value={item.q}>
                                        <AccordionTrigger>{item.q}</AccordionTrigger>
                                        <AccordionContent>{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-bold tracking-tight">Ready when you are.</h3>
                    <p className="mt-3 text-muted-foreground">Pricing is simple, onboarding is fast, cancellation is free.</p>
                    <Button asChild size="lg" className="mt-6 shadow-md">
                        <Link href="/register">Create your account</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
