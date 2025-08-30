'use client'

import * as React from 'react'
import {
    IconChartBar,
    IconCurrencyEuro,
    IconDashboard,
    IconDatabase,
    IconFileWord,
    IconFolder,
    IconListDetails,
    IconReport,
    IconUsers,
} from '@tabler/icons-react'

import { NavDocuments } from '@/components/dashboard/sidebar/NavDocuments'
import { NavMain } from '@/components/dashboard/sidebar/NavMain'
import { NavSecondary } from '@/components/dashboard/sidebar/NavSecondary'
import { NavUser } from '@/components/dashboard/sidebar/NavUser'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/',
            icon: IconDashboard,
        },
        {
            title: 'Accounts',
            url: '/accounts',
            icon: IconListDetails,
        },
        {
            title: 'Analytics (Not working)',
            url: '#',
            icon: IconChartBar,
        },
        {
            title: 'Projects (Not working)',
            url: '#',
            icon: IconFolder,
        },
        {
            title: 'Team (Not working)',
            url: '#',
            icon: IconUsers,
        },
    ],
    documents: [
        {
            name: 'Data Library (Not working)',
            url: '#',
            icon: IconDatabase,
        },
        {
            name: 'Reports (Not working)',
            url: '#',
            icon: IconReport,
        },
        {
            name: 'Word Assistant (Not working)',
            url: '#',
            icon: IconFileWord,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/">
                                <IconCurrencyEuro className="!size-7" />
                                <span className="text-base font-semibold">
                                    Velmo
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
