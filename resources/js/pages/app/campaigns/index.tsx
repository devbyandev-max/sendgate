import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Campaign = {
    id: number;
    name: string;
    total_recipients: number;
    sent_count: number;
    delivered_count: number;
    failed_count: number;
    status: string;
    scheduled_at: string | null;
};

export default function CampaignsIndex({ campaigns }: { campaigns: Campaign[] }) {
    return (
        <>
            <Head title="Campaigns" />
            <div className="space-y-6">
                <PageHeader title="Campaigns" description="Bulk SMS workflows with templating, scheduling, and delivery tracking." />

                {campaigns.length === 0 ? (
                    <EmptyState
                        icon={Megaphone}
                        title="No campaigns yet"
                        description="Create your first bulk send by uploading a CSV or selecting a contact group. (Wizard coming soon.)"
                    />
                ) : (
                    <div className="grid gap-4">
                        {campaigns.map((c) => {
                            const pct = c.total_recipients ? Math.round((c.sent_count / c.total_recipients) * 100) : 0;
                            return (
                                <Card key={c.id} className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold">{c.name}</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {c.sent_count.toLocaleString('en-PH')} / {c.total_recipients.toLocaleString('en-PH')} sent · {c.delivered_count} delivered · {c.failed_count} failed
                                            </p>
                                        </div>
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <Progress value={pct} className="mt-3" />
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
