'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useOrganization, useUser, OrganizationSwitcher } from '@clerk/nextjs'
import { 
  BarChart3,
  BoxIcon,
  Building2,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDown,
  Contact,
  Gauge,
  Home,
  LayoutDashboard,
  PanelLeftIcon,
  Settings,
  X,
} from 'lucide-react'

import { Button } from '@/lib/components/ui/button'
import { useSidebar } from './use-sidebar'
import { cn } from '@/lib/utils'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapsed } = useSidebar()
  const { user } = useUser()
  const { organization } = useOrganization()

  // Navigation items based on existing routes
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    {
      title: 'Companies',
      icon: <Building2 className="h-4 w-4" />,
      href: '/companies',
      isActive: pathname?.startsWith('/companies')
    },
    {
      title: 'Contacts',
      icon: <Contact className="h-4 w-4" />,
      href: '/contacts',
      isActive: pathname?.startsWith('/contacts')
    },
    {
      title: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      href: '/settings',
      isActive: pathname?.startsWith('/settings')
    }
  ]

  return (
    <>
      {/* Mobile only: Close button */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSidebar}
        className={`fixed bottom-4 right-4 z-50 rounded-full shadow-md lg:hidden ${isOpen ? 'flex' : 'hidden'}`}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close Sidebar</span>
      </Button>
      
      {/* Mobile only: Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          isCollapsed ? "w-16" : "w-64",
          "transform transition-all duration-300 ease-in-out",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="border-b border-sidebar-border p-4">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="bg-sidebar-primary rounded-lg p-2 flex items-center justify-center min-w-[32px] min-h-[32px]">
                {organization?.imageUrl ? (
                  <img
                    src={organization.imageUrl}
                    alt={organization?.name || 'Organization'}
                    className="h-4 w-4"
                  />
                ) : (
                  <BoxIcon className="h-4 w-4 text-sidebar-primary-foreground" />
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-12 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {organization?.imageUrl ? (
                    <img
                      src={organization.imageUrl}
                      alt={organization?.name || 'Organization'}
                      className="h-4 w-4"
                    />
                  ) : (
                    <BoxIcon className="h-4 w-4" />
                  )}
                </div>
                
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {organization?.name || 'Select Organization'}
                  </span>
                  <span className="truncate text-xs">
                    {organization?.membersCount 
                      ? `${organization.membersCount} ${organization.membersCount === 1 ? 'member' : 'members'}`
                      : 'No members'}
                  </span>
                </div>
                
                <ChevronsUpDown className="size-4 ml-auto" />
              </button>
              
              {/* Overlay the actual switcher on top */}
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "absolute inset-0",
                    organizationSwitcherTrigger: "opacity-0 w-full h-full cursor-pointer"
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {/* Navigation */}
          <div className="p-2">
            {!isCollapsed && (
              <div className="text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium">Navigation</div>
            )}
            <div className="w-full text-sm">
              <ul className={cn(
                "flex w-full min-w-0 flex-col gap-1",
                isCollapsed && "items-center"
              )}>
                {navigationItems.map((item) => (
                  <li key={item.title} className="group/menu-item relative">
                    <Link 
                      href={item.href} 
                      title={isCollapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm",
                        isCollapsed && "justify-center",
                        item.isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isCollapsed ? "w-10 h-10 mx-auto" : "w-full"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
       
        {/* User profile */}
        <div className={cn(
          "mt-auto p-4 border-t border-sidebar-border",
          isCollapsed && "flex justify-center p-2"
        )}>
          {isCollapsed ? (
            <UserButton 
              afterSignOutUrl="/login" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                  userButtonBox: "text-sidebar-foreground"
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <UserButton 
                afterSignOutUrl="/login" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8",
                    userButtonBox: "text-sidebar-foreground"
                  }
                }}
              />
              <div className="flex flex-col">
                <div className="text-sm font-medium text-sidebar-foreground">{user?.fullName || user?.username || 'User'}</div>
                <div className="text-xs text-sidebar-foreground/70">{user?.primaryEmailAddress?.emailAddress || ''}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
} 