import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Admin = {
    id: number;
    name: string;
    email: string;
    last_login_at: string | null;
    roles: Array<{ id: number; name: string }>;
};

export default function AdminAdmins({ admins }: { admins: Admin[] }) {
    return (
        <>
            <Head title="Admin · Admins" />
            <div className="space-y-6">
                <PageHeader title="Administrators" description="Users with admin or super-admin access." />
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Last login</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                                    <TableCell>
                                        {u.roles.map((r) => (
                                            <Badge key={r.id} variant="secondary" className="mr-1 capitalize">
                                                {r.name.replace('_', ' ')}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-PH') : 'Never'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
