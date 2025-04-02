'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from './_components/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/lib/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useUser()

  // Wait for user auth to be loaded 
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  // If user is not signed in, redirect to login
  if (!isSignedIn) {
    redirect('/login')
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Manufacturing Efficiency Tracking</h1>
              <SidebarTrigger className="lg:hidden" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
} 