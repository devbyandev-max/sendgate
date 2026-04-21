import { Head } from '@inertiajs/react';
import { AlertTriangle, Check, CheckCircle2, Copy, Loader2, Radio, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
    driver: string;
    yxgp: {
        host: string | null;
        username: string | null;
        charset: string;
        password_set: boolean;
    };
    callback: {
        token_set: boolean;
        urls: { sms: string | null; dlr: string | null };
    };
};

type HealthState =
    | { loading: true }
    | { loading: false; ok: boolean; status?: number; latency_ms?: number; message?: string; body_preview?: string };

export default function AdminGatewayIndex({ driver, yxgp, callback }: Props) {
    const [health, setHealth] = useState<HealthState | null>(null);

    const runHealth = async () => {
        setHealth({ loading: true });
        try {
            const res = await fetch('/admin/gateway/health', {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            setHealth({ loading: false, ...data });
        } catch (err: unknown) {
            setHealth({
                loading: false,
                ok: false,
                message: err instanceof Error ? err.message : 'Network error',
            });
        }
    };

    const copy = (value: string | null, label: string) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    };

    const liveDriver = driver === 'yxgp';
    const fullyConfigured =
        liveDriver &&
        !!yxgp.host &&
        !!yxgp.username &&
        yxgp.password_set &&
        callback.token_set;

    return (
        <>
            <Head title="Admin · Gateway" />

            <div className="space-y-6">
                <PageHeader
                    title="Hardware gateway"
                    description="Configure SendGate to talk to your YX Series GP SMS gateway."
                    actions={
                        <Button size="sm" onClick={runHealth} disabled={!!(health && 'loading' in health && health.loading)}>
                            {!!(health && 'loading' in health && health.loading) ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Radio className="size-3.5" />
                            )}
                            Run health check
                        </Button>
                    }
                />

                {/* Driver status banner */}
                <div
                    className={cn(
                        'relative overflow-hidden rounded-lg border p-4',
                        fullyConfigured
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : liveDriver
                              ? 'border-amber-500/30 bg-amber-500/5'
                              : 'border-border bg-surface-subtle/40',
                    )}
                >
                    <div className="flex items-start gap-3">
                        {fullyConfigured ? (
                            <CheckCircle2 className="mt-0.5 size-4 text-emerald-400" />
                        ) : liveDriver ? (
                            <AlertTriangle className="mt-0.5 size-4 text-amber-400" />
                        ) : (
                            <Radio className="mt-0.5 size-4 text-muted-foreground" />
                        )}
                        <div>
                            <p className="text-sm font-semibold">
                                {fullyConfigured
                                    ? 'YX GP driver is configured and live'
                                    : liveDriver
                                      ? 'YX GP driver selected — configuration incomplete'
                                      : 'Stub driver — messages are simulated locally'}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Driver: <span className="font-mono">{driver}</span>
                                {liveDriver && yxgp.host && (
                                    <>
                                        {' '}
                                        · Host: <span className="font-mono">{yxgp.host}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Health result */}
                {health && !health.loading && (
                    <Card>
                        <CardContent className="pt-5">
                            <div className="flex items-start gap-3">
                                {health.ok ? (
                                    <CheckCircle2 className="mt-0.5 size-4 text-emerald-400" />
                                ) : (
                                    <XCircle className="mt-0.5 size-4 text-red-400" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold">
                                        {health.ok ? 'Gateway is reachable' : 'Gateway check failed'}
                                    </p>
                                    {typeof health.status === 'number' && (
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            HTTP {health.status} · {health.latency_ms}ms
                                        </p>
                                    )}
                                    {health.message && (
                                        <p className="mt-1 text-xs text-muted-foreground">{health.message}</p>
                                    )}
                                    {health.body_preview && (
                                        <pre className="mt-2 overflow-x-auto rounded-md bg-surface-subtle p-2 font-mono text-[11px] text-muted-foreground">
                                            {health.body_preview}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Two-column: Our config (left), What to set on the device (right) */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Laravel-side configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Laravel configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ConfigRow label="GATEWAY_DRIVER" value={driver} ok={liveDriver} hint="Set to 'yxgp' in .env" />
                            <ConfigRow label="YXGP_HOST" value={yxgp.host} ok={!!yxgp.host} hint="e.g. 192.168.1.100:8080" />
                            <ConfigRow label="YXGP_USERNAME" value={yxgp.username} ok={!!yxgp.username} />
                            <ConfigRow label="YXGP_PASSWORD" value={yxgp.password_set ? '••••••••' : null} ok={yxgp.password_set} />
                            <ConfigRow label="YXGP_CHARSET" value={yxgp.charset} ok />
                            <ConfigRow label="GATEWAY_CALLBACK_TOKEN" value={callback.token_set ? '(set)' : null} ok={callback.token_set} hint="Shared secret for callback URLs" />

                            <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
                                Edit <code className="rounded bg-muted px-1 font-mono">.env</code> on the server, then run{' '}
                                <code className="rounded bg-muted px-1 font-mono">php artisan config:clear</code>.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Device-side configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>YX GP device configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    SMS Setting → SMS to HTTP (inbound SMS)
                                </p>
                                <div className="mt-2 space-y-1.5 text-xs">
                                    <DeviceField label="Forward Protocol" value="HTTP (POST)" />
                                    <DeviceField
                                        label="URL"
                                        value={callback.urls.sms ?? 'Set GATEWAY_CALLBACK_TOKEN first'}
                                        copyable={!!callback.urls.sms}
                                        onCopy={() => copy(callback.urls.sms, 'Inbound-SMS URL')}
                                    />
                                    <DeviceField label="Charset" value="UTF-8" />
                                    <DeviceField label="Sender" value="$(sender)" mono />
                                    <DeviceField label="Receiver" value="$(receiver)" mono />
                                    <DeviceField label="Device Port" value="$(port)" mono />
                                    <DeviceField label="Content" value="$(content)" mono />
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Status Notification (delivery reports)
                                </p>
                                <div className="mt-2 space-y-1.5 text-xs">
                                    <DeviceField
                                        label="URL"
                                        value={callback.urls.dlr ?? 'Set GATEWAY_CALLBACK_TOKEN first'}
                                        copyable={!!callback.urls.dlr}
                                        onCopy={() => copy(callback.urls.dlr, 'DLR URL')}
                                    />
                                    <DeviceField label="Method" value="POST" />
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    SIM port mapping
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    In the YX GP web admin, note the <strong>Port No</strong> each SIM is installed in
                                    (1–64). Enter the same number into <strong>Admin → SIMs → Port</strong> for each
                                    SIM — SendGate uses that to route outbound SMS to the right slot.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Step-by-step wizard */}
                <Card>
                    <CardHeader>
                        <CardTitle>Setup walkthrough</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-3 text-sm">
                            {steps.map((s, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="flex size-6 flex-none items-center justify-center rounded-full border border-border bg-surface-subtle font-mono text-[11px] tabular-nums text-muted-foreground">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground">{s.title}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{s.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function ConfigRow({
    label,
    value,
    ok,
    hint,
}: {
    label: string;
    value: string | null;
    ok: boolean;
    hint?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-subtle px-3 py-2">
            <div className="min-w-0">
                <p className="font-mono text-[11px] font-semibold tracking-wide">{label}</p>
                {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="truncate font-mono text-[11px] text-foreground">{value}</span>}
                {ok ? (
                    <Check className="size-3.5 text-emerald-400" />
                ) : (
                    <XCircle className="size-3.5 text-muted-foreground" />
                )}
            </div>
        </div>
    );
}

function DeviceField({
    label,
    value,
    mono,
    copyable,
    onCopy,
}: {
    label: string;
    value: string;
    mono?: boolean;
    copyable?: boolean;
    onCopy?: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
                <code
                    className={cn(
                        'rounded border border-border bg-surface-subtle px-1.5 py-0.5 text-[11px]',
                        mono && 'font-mono',
                    )}
                >
                    {value}
                </code>
                {copyable && (
                    <button
                        onClick={onCopy}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Copy"
                    >
                        <Copy className="size-3" />
                    </button>
                )}
            </div>
        </div>
    );
}

const steps = [
    {
        title: 'Set environment variables',
        body: 'Add YXGP_HOST, YXGP_USERNAME, YXGP_PASSWORD, GATEWAY_CALLBACK_TOKEN to your .env. Change GATEWAY_DRIVER to "yxgp". Run `php artisan config:clear`.',
    },
    {
        title: 'Register SIMs',
        body: 'In Admin → SIMs, insert one row per SIM slot. Set the Port No to match the device UI (1–64).',
    },
    {
        title: 'Configure SMS → HTTP on the device',
        body: 'Device web admin → SMS Setting → SMS Settings. Use POST, the "Inbound SMS" URL above, UTF-8, and the sender/receiver/port/content placeholders.',
    },
    {
        title: 'Configure Status Notification',
        body: 'Device web admin → section 7.19 "Status Notification". Paste the DLR URL above.',
    },
    {
        title: 'Run the health check',
        body: 'Click "Run health check" at the top of this page. On success, the device is reachable over HTTP.',
    },
    {
        title: 'Send a test SMS',
        body: 'From /app/sms/send, pick a SIM and send to your own phone. Watch Admin → Messages for the send, then the delivery report.',
    },
];
