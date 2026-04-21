import { Head } from '@inertiajs/react';

export default function MarketingTerms() {
    return (
        <>
            <Head title="Terms of Service" />
            <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
                <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-PH')}</p>

                <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-8 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
                    <section>
                        <h2>1. Acceptance</h2>
                        <p>
                            By registering for or using SendGate, you agree to these Terms. If you are entering into this
                            agreement on behalf of a company, you represent that you have authority to bind that company.
                        </p>
                    </section>

                    <section>
                        <h2>2. Service description</h2>
                        <p>
                            SendGate provides a Bring-Your-Own-SIM SMS gateway service. Customers ship an active Philippine
                            SIM to SendGate, which is inserted into hardware operated by SendGate. Customers can send and
                            receive SMS from that SIM through the SendGate dashboard and REST API.
                        </p>
                    </section>

                    <section>
                        <h2>3. Customer responsibilities</h2>
                        <ul>
                            <li>You must own and be authorized to use any SIM you ship to SendGate.</li>
                            <li>You are responsible for keeping the SIM in good standing with its carrier, including load top-ups.</li>
                            <li>You must obtain clear, documented consent from recipients before sending marketing SMS.</li>
                            <li>You must include opt-out instructions (e.g. "Reply STOP to unsubscribe") in every marketing campaign.</li>
                        </ul>
                    </section>

                    <section id="aup">
                        <h2>4. Acceptable use</h2>
                        <p>You agree not to use SendGate to send content that is:</p>
                        <ul>
                            <li>Unlawful, defamatory, or fraudulent.</li>
                            <li>Phishing, scams, fake prize claims, or other deceptive messaging.</li>
                            <li>Adult content directed to minors.</li>
                            <li>Unsolicited to recipients who have not consented.</li>
                            <li>Content that violates carrier policies or the NTC’s guidelines.</li>
                        </ul>
                        <p>SendGate may suspend or terminate accounts that breach this section without notice.</p>
                    </section>

                    <section>
                        <h2>5. Fees & payment</h2>
                        <p>
                            Fees are billed monthly in advance per SIM. Non-payment beyond 14 days from invoice due date
                            may result in service suspension. Continued non-payment may lead to SIM return at the
                            customer’s expense and account closure.
                        </p>
                    </section>

                    <section>
                        <h2>6. Service availability</h2>
                        <p>
                            SendGate targets 99.5% monthly uptime but does not guarantee carrier-side deliverability,
                            which depends on your SIM’s status with its carrier.
                        </p>
                    </section>

                    <section>
                        <h2>7. Termination</h2>
                        <p>
                            You may cancel at any time from the billing page. Upon cancellation, we will ship your SIM
                            back to your registered address at our expense within 3 business days.
                        </p>
                    </section>

                    <section>
                        <h2>8. Limitation of liability</h2>
                        <p>
                            To the maximum extent permitted by law, SendGate is not liable for indirect, incidental, or
                            consequential damages. Our aggregate liability is capped at the amount paid to SendGate in
                            the 3 months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2>9. Governing law</h2>
                        <p>These Terms are governed by the laws of the Republic of the Philippines. Venue is in Makati City.</p>
                    </section>
                </div>
            </section>
        </>
    );
}
