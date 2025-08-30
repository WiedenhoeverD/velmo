'use client'

import * as React from 'react'
import { IconHelp, IconMoon, IconSettings, IconSun } from '@tabler/icons-react'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useTheme } from 'next-themes'

export function NavSecondary(
    props: React.ComponentPropsWithoutRef<typeof SidebarGroup>
) {
    const { setTheme, theme } = useTheme()
    const data = [
        {
            title: 'Settings (Not working)',
            url: '#',
            icon: IconSettings,
        },
        {
            title: 'Get Help',
            url: 'https://github.com/WiedenhoeverD/velmo',
            icon: IconHelp,
        },
    ]
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {data.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="cursor-pointer"
                            onClick={() =>
                                theme === 'light'
                                    ? setTheme('dark')
                                    : setTheme('light')
                            }
                        >
                            <span className="relative inline-flex items-center">
                                {theme === 'light' ? <IconSun /> : <IconMoon />}
                                <span>Toggle Theme</span>
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
