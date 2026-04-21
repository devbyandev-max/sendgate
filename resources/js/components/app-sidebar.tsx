import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    CreditCard,
    FileText,
    Inbox,
    Key,
    LayoutGrid,
    LifeBuoy,
    Megaphone,
    MessageCircle,
    MessagesSquare,
    Radio,
    Send,
    Settings as SettingsIcon,
    ShieldCheck,
    Timer,
    Users,
    Webhook,
} from 'lucide-react';

import { SendGateMark } from '@/components/marketing/sendgate-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { SharedData } from '@/types';
import type { NavGroup, NavItem } from '@/types/navigation';

const customerGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            { title: 'Dashboard', href: '/app/dashboard', icon: LayoutGrid },
            { title: 'Analytics', href: '/app/analytics', icon: BarChart3 },
        ],
    },
    {
        label: 'Messaging',
        items: [
            { title: 'Conversations', href: '/app/conversations', icon: MessagesSquare },
            { title: 'Send SMS', href: '/app/sms/send', icon: Send },
            { title: 'Inbox', href: '/app/sms/inbox', icon: Inbox },
            { title: 'Outbox', href: '/app/sms/outbox', icon: MessageCircle },
            { title: 'Scheduled', href: '/app/sms/scheduled', icon: Timer },
            { title: 'Campaigns', href: '/app/campaigns', icon: Megaphone },
        ],
    },
    {
        label: 'Contacts & SIMs',
        items: [
            { title: 'SIMs', href: '/app/sims', icon: Radio },
            { title: 'Contacts', href: '/app/contacts', icon: Users },
        ],
    },
    {
        label: 'Developer',
        items: [
            { title: 'API keys', href: '/app/api-keys', icon: Key },
            { title: 'Webhooks', href: '/app/webhooks', icon: Webhook },
        ],
    },
    {
        label: 'Account',
        items: [{ title: 'Billing', href: '/app/billing', icon: CreditCard }],
    },
];

const adminGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
            { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        ],
    },
    {
        label: 'Customers',
        items: [
            { title: 'Customers', href: '/admin/customers', icon: Users },
            { title: 'SIMs', href: '/admin/sims', icon: Radio },
            { title: 'Messages', href: '/admin/messages', icon: MessageCircle },
        ],
    },
    {
        label: 'Revenue',
        items: [
            { title: 'Invoices', href: '/admin/invoices', icon: FileText },
            { title: 'Payments', href: '/admin/payments', icon: CreditCard },
        ],
    },
    {
        label: 'System',
        items: [
            { title: 'Gateway', href: '/admin/gateway', icon: Radio },
            { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
            { title: 'Admins', href: '/admin/admins', icon: ShieldCheck },
            { title: 'Activity logs', href: '/admin/activity-logs', icon: FileText },
        ],
    },
];

const footerNavItems: NavItem[] = [
    { title: 'Docs', href: '/docs', icon: FileText },
    { title: 'Support', href: 'mailto:support@sendgate.ph', icon: LifeBuoy },
    { title: 'Settings', href: '/settings/profile', icon: SettingsIcon },
];

export function AppSidebar() {
    const { auth, url } = usePage<SharedData & { url: string }>().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : (url as string | undefined) ?? '';
    const inAdmin = path.startsWith('/admin');
    const isAdmin = auth?.user?.is_admin;
    const groups = inAdmin && isAdmin ? adminGroups : customerGroups;
    const homeHref = inAdmin && isAdmin ? '/admin/dashboard' : '/app/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/60">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="gap-2.5">
                            <Link href={homeHref} prefetch>
                                <SendGateMark className="size-7 shrink-0" />
                                <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate text-sm font-bold tracking-tight">
                                        Send<span className="text-primary">Gate</span>
                                    </span>
                                    <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {inAdmin && isAdmin ? 'Admin console' : 'SMS gateway'}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4 py-4">
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
