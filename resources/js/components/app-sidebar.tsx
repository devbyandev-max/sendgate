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
import type { NavItem, SharedData } from '@/types';

const customerNav: NavItem[] = [
    { title: 'Dashboard', href: '/app/dashboard', icon: LayoutGrid },
    { title: 'SIMs', href: '/app/sims', icon: Radio },
    { title: 'Send SMS', href: '/app/sms/send', icon: Send },
    { title: 'Inbox', href: '/app/sms/inbox', icon: Inbox },
    { title: 'Outbox', href: '/app/sms/outbox', icon: MessageCircle },
    { title: 'Scheduled', href: '/app/sms/scheduled', icon: Timer },
    { title: 'Campaigns', href: '/app/campaigns', icon: Megaphone },
    { title: 'Contacts', href: '/app/contacts', icon: Users },
    { title: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    { title: 'API keys', href: '/app/api-keys', icon: Key },
    { title: 'Webhooks', href: '/app/webhooks', icon: Webhook },
    { title: 'Billing', href: '/app/billing', icon: CreditCard },
];

const adminNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Customers', href: '/admin/customers', icon: Users },
    { title: 'SIMs', href: '/admin/sims', icon: Radio },
    { title: 'Messages', href: '/admin/messages', icon: MessageCircle },
    { title: 'Invoices', href: '/admin/invoices', icon: FileText },
    { title: 'Payments', href: '/admin/payments', icon: CreditCard },
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { title: 'Admins', href: '/admin/admins', icon: ShieldCheck },
    { title: 'Activity logs', href: '/admin/activity-logs', icon: FileText },
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
    const items = inAdmin && isAdmin ? adminNav : customerNav;
    const homeHref = inAdmin && isAdmin ? '/admin/dashboard' : '/app/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <div className="flex items-center gap-2">
                                    <SendGateMark className="size-7" />
                                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="text-base font-extrabold tracking-tight">
                                            Send<span className="text-primary">Gate</span>
                                        </span>
                                        {inAdmin && isAdmin && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
