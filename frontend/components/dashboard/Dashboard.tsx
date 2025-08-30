'use client'

import { useSession } from 'next-auth/react'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from './sidebar/AppSidebar'
import Login from './Login'

export default function Dashboard({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = useSession()

    if (session.status !== 'authenticated') {
        return <Login />
    }

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    )
}
