'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, OrganizationSwitcher, useOrganization, useUser } from '@clerk/nextjs'
import { 
  BarChart3, 
  Building2, 
  Factory, 
  Gauge, 
  LayoutDashboard, 
  Settings, 
  Users2 
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { SelectProfile } from '@/db/schema/profiles'
import { SelectCompany } from '@/db/schema/companies'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/lib/components/ui/sidebar'

// Action response type - for consistency with our server actions
type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// Mock functions to avoid import errors - replace with real imports when backend issues are fixed
async function getOrCreateProfile(): Promise<ActionResponse<SelectProfile>> {
  return { success: true, message: "Profile loaded", data: { userId: "user123", role: "admin" } as SelectProfile };
}

async function getOrCreateCompanyFromOrganization(): Promise<ActionResponse<SelectCompany>> {
  return { success: true, message: "Company loaded", data: { id: "company123", name: "Example Company", industry: "Manufacturing" } as SelectCompany };
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href}>
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { organization } = useOrganization()
  const [profile, setProfile] = useState<SelectProfile | null>(null)
  const [company, setCompany] = useState<SelectCompany | null>(null)

  // Load profile data when user is available
  useEffect(() => {
    async function loadData() {
      if (user) {
        // Get or create user profile
        const profileResult = await getOrCreateProfile()
        if (profileResult.success && profileResult.data) {
          setProfile(profileResult.data)
        }

        // Get or create company from organization
        const companyResult = await getOrCreateCompanyFromOrganization()
        if (companyResult.success && companyResult.data) {
          setCompany(companyResult.data)
        }
      }
    }
    
    loadData()
  }, [user, organization?.id])

  // Define navigation items
  const platformItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      label: "Dashboard",
      isActive: pathname === '/dashboard'
    },
    {
      href: "/sites",
      icon: <Building2 className="h-4 w-4 mr-2" />,
      label: "Sites",
      isActive: pathname.startsWith('/sites')
    },
    {
      href: "/value-streams",
      icon: <Gauge className="h-4 w-4 mr-2" />,
      label: "Value Streams",
      isActive: pathname.startsWith('/value-streams')
    },
    {
      href: "/cells",
      icon: <Factory className="h-4 w-4 mr-2" />,
      label: "Cells",
      isActive: pathname.startsWith('/cells')
    },
    {
      href: "/metrics",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      label: "Metrics",
      isActive: pathname.startsWith('/metrics')
    },
    {
      href: "/operators",
      icon: <Users2 className="h-4 w-4 mr-2" />,
      label: "Operators",
      isActive: pathname.startsWith('/operators')
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <Factory className="h-6 w-6" />
          <span className="font-semibold text-xl">CellFlow</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Organization Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1.5">Company</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <OrganizationSwitcher 
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger: "w-full bg-secondary/50 hover:bg-secondary/80 rounded-md p-2"
                  }
                }}
              />
              {company && (
                <div className="mt-2 text-xs text-muted-foreground overflow-hidden">
                  <p className="truncate">{company.industry || 'No industry set'}</p>
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Platform Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1.5">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformItems.map((item) => (
                <NavItem 
                  key={item.href}
                  href={item.href} 
                  icon={item.icon}
                  label={item.label}
                  isActive={item.isActive}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1.5">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem 
                href="/settings" 
                icon={<Settings className="h-4 w-4 mr-2" />}
                label="Settings"
                isActive={pathname.startsWith('/settings')}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserButton 
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8"
                }
              }}
            />
            <div className="flex flex-col text-sm">
              <span className="font-medium">{user?.fullName || 'User'}</span>
              <span className="text-xs text-muted-foreground">{profile?.role || 'Loading...'}</span>
            </div>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
} 