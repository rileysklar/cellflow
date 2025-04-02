'use client'

import { useUser } from '@clerk/nextjs'
import React from 'react'

import { DashboardSidebar } from './_components/dashboard-sidebar'
import { DashboardHeader } from './_components/dashboard-header'
import { SidebarProvider } from './_components/use-sidebar'
import { useSidebar } from './_components/use-sidebar'

// Wrapper component to access sidebar context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardSidebar />
      <div className={`flex w-full flex-col ${isCollapsed ? 'lg:pl-16' : 'lg:pl-64'} transition-all duration-300`}>
        <DashboardHeader />
        <main className="flex-1 p-6 bg-[var(--background)]">{children}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>
  }

  return (
    <SidebarProvider defaultOpen defaultCollapsed={false}>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
} 