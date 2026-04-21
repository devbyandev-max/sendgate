import { Head, useForm } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Announcement = {
    id: number;
    title: string;
    body: string;
    audience: string;
    published_at: string | null;
    admin: { id: number; name: string };
    created_at: string;
};

export default function AdminAnnouncements({ announcements }: { announcements: Announcement[] }) {
    const create = useForm({ title: '', body: '', audience: 'all', publish: false });

    const submit = (publishNow: boolean, e: React.FormEvent) => {
        e.preventDefault();
        create.transform((d) => ({ ...d, publish: publishNow }));
        create.post('/admin/announcements', {
            preserveScroll: true,
            onSuccess: () => create.reset(),
        });
    };

    return (
        <>
            <Head title="Admin · Announcements" />
            <div className="space-y-6">
                <PageHeader title="Announcements" description="Broadcast messages to your customers." />

                <Card className="p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compose</h3>
                    <form className="mt-4 space-y-4">
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input value={create.data.title} onChange={(e) => create.setData('title', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Body (Markdown supported)</Label>
                            <Textarea rows={6} value={create.data.body} onChange={(e) => create.setData('body', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Audience</Label>
                            <Select value={create.data.audience} onValueChange={(v) => create.setData('audience', v)}>
                                <SelectTrigger className="max-w-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All customers</SelectItem>
                                    <SelectItem value="active">Active only</SelectItem>
                                    <SelectItem value="suspended">Suspended only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={(e) => submit(false, e)} disabled={create.processing}>
                                Save as draft
                            </Button>
                            <Button onClick={(e) => submit(true, e)} disabled={create.processing}>
                                Publish now
                            </Button>
                        </div>
                    </form>
                </Card>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent</h3>
                    {announcements.length === 0 ? (
                        <EmptyState className="mt-4" icon={Megaphone} title="No announcements yet" />
                    ) : (
                        <ul className="mt-4 space-y-3">
                            {announcements.map((a) => (
                                <li key={a.id} className="rounded-xl border border-border bg-card p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-semibold">{a.title}</h4>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {a.published_at ? `Published ${new Date(a.published_at).toLocaleDateString('en-PH')}` : 'Draft'} · {a.audience}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}
