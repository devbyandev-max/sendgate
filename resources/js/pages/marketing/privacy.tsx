import { Head } from '@inertiajs/react';

export default function MarketingPrivacy() {
    return (
        <>
            <Head title="Privacy Policy" />
            <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-PH')}</p>

                <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-8 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
                    <section>
                        <h2>Information we collect</h2>
                        <ul>
                            <li>Account information — name, email, company, phone, role.</li>
                            <li>Billing information — bank transfer reference numbers, payment proofs.</li>
                            <li>SMS content — messages you send and receive through our platform.</li>
                            <li>Usage data — API requests, dashboard events, delivery logs, IP addresses.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>How we use it</h2>
                        <p>
                            To deliver the SendGate service, process payments, ensure platform security, prevent abuse,
                            and comply with legal obligations under the Data Privacy Act of 2012.
                        </p>
                    </section>

                    <section>
                        <h2>Data retention</h2>
                        <p>
                            SMS bodies are retained for 90 days by default for deliverability troubleshooting. Metadata
                            (timestamps, to/from numbers, status) is retained for 18 months. You may request earlier
                            deletion at any time by emailing <a className="text-primary underline" href="mailto:privacy@sendgate.ph">privacy@sendgate.ph</a>.
                        </p>
                    </section>

                    <section>
                        <h2>Your rights (Data Privacy Act)</h2>
                        <ul>
                            <li>Right to be informed about processing of your personal data.</li>
                            <li>Right to access, correct, or erase your data.</li>
                            <li>Right to withdraw consent and to object to processing.</li>
                            <li>Right to data portability and to lodge a complaint with the NPC.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Security</h2>
                        <p>
                            TLS everywhere in transit. Encryption at rest. Role-based access internally. 2FA available
                            for all accounts. Sensitive values such as API keys are stored as SHA-256 hashes — we can
                            verify, but never recover, them.
                        </p>
                    </section>

                    <section>
                        <h2>Third parties</h2>
                        <p>
                            We do not sell personal data. We share only with vetted processors required to run the
                            service (data center, email provider, payment reconciliation) under standard contractual
                            protections.
                        </p>
                    </section>

                    <section>
                        <h2>Contact</h2>
                        <p>
                            Data Protection Officer: <a className="text-primary underline" href="mailto:privacy@sendgate.ph">privacy@sendgate.ph</a>.
                        </p>
                    </section>
                </div>
            </section>
        </>
    );
}
