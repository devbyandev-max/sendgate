import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { CodeTabs, type CodeSample } from '@/components/marketing/code-tabs';
import { cn } from '@/lib/utils';

const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'errors', title: 'Errors' },
    { id: 'rate-limits', title: 'Rate limits' },
    { id: 'messages', title: 'Messages' },
    { id: 'sims', title: 'SIMs' },
    { id: 'contacts', title: 'Contacts' },
    { id: 'account', title: 'Account' },
    { id: 'webhooks', title: 'Webhooks' },
    { id: 'changelog', title: 'Changelog' },
];

const sendSamples: CodeSample[] = [
    {
        label: 'cURL',
        language: 'bash',
        code: `curl -X POST https://sendgate.ph/api/v1/messages \\
  -H "Authorization: Bearer sg_live_abcd1234_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sim_id": "1",
    "to": "+639171234567",
    "message": "Hi! Your OTP is 482913."
  }'`,
    },
    {
        label: 'PHP',
        language: 'php',
        code: `<?php

$response = Http::withToken('sg_live_abcd1234_xxx...')
    ->post('https://sendgate.ph/api/v1/messages', [
        'sim_id'  => 1,
        'to'      => '+639171234567',
        'message' => 'Hi! Your OTP is 482913.',
    ]);

$data = $response->json();`,
    },
    {
        label: 'Node.js',
        language: 'javascript',
        code: `const res = await fetch('https://sendgate.ph/api/v1/messages', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer sg_live_abcd1234_xxx...',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sim_id: 1,
    to: '+639171234567',
    message: 'Hi! Your OTP is 482913.',
  }),
});

const data = await res.json();`,
    },
    {
        label: 'Python',
        language: 'python',
        code: `import requests

response = requests.post(
    "https://sendgate.ph/api/v1/messages",
    headers={"Authorization": "Bearer sg_live_abcd1234_xxx..."},
    json={
        "sim_id": 1,
        "to": "+639171234567",
        "message": "Hi! Your OTP is 482913.",
    },
)

data = response.json()`,
    },
];

const listSamples: CodeSample[] = [
    {
        label: 'cURL',
        language: 'bash',
        code: `curl https://sendgate.ph/api/v1/messages?page=1&per_page=25 \\
  -H "Authorization: Bearer sg_live_..."`,
    },
    {
        label: 'PHP',
        language: 'php',
        code: `Http::withToken('sg_live_...')
    ->get('https://sendgate.ph/api/v1/messages', ['per_page' => 25]);`,
    },
    {
        label: 'Node.js',
        language: 'javascript',
        code: `fetch('https://sendgate.ph/api/v1/messages?per_page=25', {
  headers: { Authorization: 'Bearer sg_live_...' }
}).then(r => r.json());`,
    },
];

const webhookSample: CodeSample[] = [
    {
        label: 'JSON',
        language: 'json',
        code: `{
  "event": "message.delivered",
  "data": {
    "id": 91823,
    "sim_id": 1,
    "to": "+639171234567",
    "status": "delivered",
    "delivered_at": "2026-04-20T14:21:03+08:00"
  },
  "signature": "sha256=..."
}`,
    },
];

export default function MarketingDocs() {
    const [active, setActive] = useState(sections[0].id);

    useEffect(() => {
        const observers = sections.map((s) => {
            const el = document.getElementById(s.id);
            if (!el) return null;
            const io = new IntersectionObserver(
                (entries) => entries.forEach((e) => e.isIntersecting && setActive(s.id)),
                { rootMargin: '-40% 0px -50% 0px' },
            );
            io.observe(el);
            return io;
        });
        return () => {
            observers.forEach((io) => io?.disconnect());
        };
    }, []);

    return (
        <>
            <Head title="API Documentation">
                <meta name="description" content="SendGate REST API reference — authentication, errors, rate limits, messages, SIMs, contacts, webhooks." />
            </Head>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API reference</h2>
                            <ul className="mt-4 space-y-1">
                                {sections.map((s) => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className={cn(
                                                'block rounded-md px-3 py-1.5 text-sm transition-colors',
                                                active === s.id
                                                    ? 'bg-primary/10 font-semibold text-primary'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="min-w-0 space-y-16">
                        <DocSection id="introduction" title="Introduction" intro="The SendGate API is organized around REST. It has predictable resource-oriented URLs, uses JSON-encoded bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.">
                            <Paragraph>
                                Base URL: <Code>https://sendgate.ph/api/v1</Code>. All requests must be authenticated with an API key.
                            </Paragraph>
                        </DocSection>

                        <DocSection id="authentication" title="Authentication" intro="Authenticate your API requests by including your secret API key in the Authorization header. Keys are prefixed sg_live_ so you can identify them at a glance.">
                            <TwoColumn
                                left={
                                    <>
                                        <Paragraph>
                                            Your API key carries many privileges — keep it secret. Do not commit it to source
                                            control, share it over email, or expose it in client-side code. Generate keys in
                                            the dashboard under <strong>API keys</strong>.
                                        </Paragraph>
                                    </>
                                }
                                right={
                                    <CodeTabs
                                        samples={[
                                            {
                                                label: 'cURL',
                                                language: 'bash',
                                                code: `curl https://sendgate.ph/api/v1/account \\\n  -H "Authorization: Bearer sg_live_abcd1234_xxx..."`,
                                            },
                                        ]}
                                    />
                                }
                            />
                        </DocSection>

                        <DocSection id="errors" title="Errors" intro="SendGate uses standard HTTP response codes. 2xx for success, 4xx for client errors, 5xx for server errors.">
                            <div className="overflow-hidden rounded-xl border border-border bg-card">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left">Code</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            ['400', 'invalid_request', 'Malformed payload or missing required field.'],
                                            ['401', 'unauthorized', 'Missing, invalid, or revoked API key.'],
                                            ['403', 'forbidden', 'Authenticated but not allowed for this action.'],
                                            ['404', 'not_found', 'Resource does not exist.'],
                                            ['422', 'validation_failed', 'Validation errors. Check `error.details`.'],
                                            ['429', 'rate_limited', 'Rate limit exceeded. Retry after `Retry-After` header.'],
                                            ['500', 'server_error', 'Something went wrong on our end. Please retry.'],
                                        ].map(([s, c, d]) => (
                                            <tr key={c} className="hover:bg-muted/40">
                                                <td className="px-4 py-3 font-mono text-xs">{s}</td>
                                                <td className="px-4 py-3 font-mono text-xs text-primary">{c}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{d}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DocSection>

                        <DocSection id="rate-limits" title="Rate limits" intro="Each API key is limited to 60 requests per minute. The current remaining quota is returned in the X-RateLimit-Remaining response header.">
                            <Paragraph>
                                Exceeding the limit returns a 429 response with a <Code>Retry-After</Code> header. To send
                                at higher throughput, add more SIMs — throughput scales linearly.
                            </Paragraph>
                        </DocSection>

                        <DocSection id="messages" title="Messages" intro="Send an SMS, list sent messages, retrieve a specific message, or schedule a future send.">
                            <h3 className="mt-8 text-base font-semibold">POST /messages</h3>
                            <Paragraph>Send an SMS through one of your SIMs.</Paragraph>
                            <CodeTabs samples={sendSamples} className="mt-4" />

                            <h3 className="mt-10 text-base font-semibold">GET /messages</h3>
                            <Paragraph>Retrieve a paginated list of sent and received messages.</Paragraph>
                            <CodeTabs samples={listSamples} className="mt-4" />
                        </DocSection>

                        <DocSection id="sims" title="SIMs" intro="List your SIMs, inspect one, check its balance.">
                            <CodeTabs
                                samples={[
                                    { label: 'cURL', language: 'bash', code: 'curl https://sendgate.ph/api/v1/sims -H "Authorization: Bearer sg_live_..."' },
                                    { label: 'PHP', language: 'php', code: "Http::withToken('sg_live_...')->get('https://sendgate.ph/api/v1/sims');" },
                                ]}
                            />
                        </DocSection>

                        <DocSection id="contacts" title="Contacts" intro="Create, list, and manage your contacts via the API.">
                            <CodeTabs
                                samples={[
                                    {
                                        label: 'cURL',
                                        language: 'bash',
                                        code: `curl -X POST https://sendgate.ph/api/v1/contacts \\\n  -H "Authorization: Bearer sg_live_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"Juan dela Cruz","phone_number":"+639171234567"}'`,
                                    },
                                ]}
                            />
                        </DocSection>

                        <DocSection id="account" title="Account" intro="Fetch information about the account tied to the current API key.">
                            <CodeTabs
                                samples={[
                                    { label: 'cURL', language: 'bash', code: 'curl https://sendgate.ph/api/v1/account -H "Authorization: Bearer sg_live_..."' },
                                ]}
                            />
                        </DocSection>

                        <DocSection id="webhooks" title="Webhooks" intro="Subscribe to events and receive HTTPS callbacks signed with an HMAC-SHA256 signature.">
                            <Paragraph>
                                Every webhook POST includes a <Code>X-SendGate-Signature</Code> header. Verify it by computing
                                <Code>HMAC-SHA256(secret, raw_body)</Code>. Supported events:
                            </Paragraph>
                            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                                <li><Code>message.delivered</Code></li>
                                <li><Code>message.failed</Code></li>
                                <li><Code>message.received</Code></li>
                                <li><Code>sim.suspended</Code></li>
                                <li><Code>invoice.generated</Code></li>
                                <li><Code>payment.approved</Code></li>
                            </ul>
                            <h3 className="mt-6 text-base font-semibold">Sample payload</h3>
                            <CodeTabs samples={webhookSample} className="mt-4" />
                        </DocSection>

                        <DocSection id="changelog" title="Changelog" intro="Notable updates to the API.">
                            <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
                                <li>
                                    <strong className="text-foreground">v1.0.0 — April 2026.</strong> Public launch of
                                    Messages, SIMs, Contacts, Account endpoints. Webhooks beta.
                                </li>
                            </ul>
                        </DocSection>
                    </div>
                </div>
            </div>
        </>
    );
}

function DocSection({
    id,
    title,
    intro,
    children,
}: {
    id: string;
    title: string;
    intro: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24">
            <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
            <p className="mt-3 text-base text-muted-foreground">{intro}</p>
            <div className="mt-6">{children}</div>
        </section>
    );
}

function Paragraph({ children }: { children: React.ReactNode }) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
    return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground">{children}</code>
    );
}

function TwoColumn({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div>{left}</div>
            <div>{right}</div>
        </div>
    );
}
