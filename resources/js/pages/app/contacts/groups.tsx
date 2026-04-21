import { Head } from '@inertiajs/react';
import { Folder } from 'lucide-react';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Card } from '@/components/ui/card';

type Group = { id: number; name: string; color: string; contacts_count: number };

export default function ContactGroups({ groups }: { groups: Group[] }) {
    return (
        <>
            <Head title="Contact groups" />
            <div className="space-y-6">
                <PageHeader title="Contact groups" description="Organize contacts into reusable lists for campaigns." />
                {groups.length === 0 ? (
                    <EmptyState icon={Folder} title="No groups yet" description="Create a group from the contacts list." />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((g) => (
                            <Card key={g.id} className="p-5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="inline-block size-3 rounded-full"
                                        style={{ backgroundColor: g.color }}
                                    />
                                    <h3 className="font-semibold">{g.name}</h3>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{g.contacts_count} contacts</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
