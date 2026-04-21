import { Link } from '@inertiajs/react';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types/navigation';

type Props = {
    /** Grouped nav — preferred */
    groups?: NavGroup[];
    /** Legacy flat list — still supported */
    items?: NavItem[];
};

export function NavMain({ groups, items }: Props) {
    const { isCurrentUrl } = useCurrentUrl();

    const normalisedGroups: NavGroup[] = groups ?? (items ? [{ label: 'Platform', items }] : []);

    return (
        <>
            {normalisedGroups.map((group) => (
                <SidebarGroup key={group.label} className="px-2 py-0">
                    <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80">
                        {group.label}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            const active = isCurrentUrl(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={cn(
                                            'h-8 rounded-md text-[13px]',
                                            active &&
                                                'bg-sidebar-accent text-foreground font-medium shadow-[inset_0_1px_0_0_rgb(255_255_255/0.04)]',
                                        )}
                                    >
                                        <Link href={item.href} prefetch className="gap-2.5">
                                            {item.icon && (
                                                <item.icon
                                                    className={cn(
                                                        'size-4 transition-colors',
                                                        active ? 'text-primary' : 'text-muted-foreground',
                                                    )}
                                                />
                                            )}
                                            <span className="flex-1">{item.title}</span>
                                            {item.badge !== undefined && (
                                                <span className="ml-auto inline-flex min-w-4 items-center justify-center rounded bg-primary/15 px-1 text-[10px] font-semibold text-primary">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
