'use client'

import React from 'react'
import { ChevronRightIcon, MenuIcon, PanelLeftIcon, ChevronLeftIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { useSidebar } from './use-sidebar'
import { Button } from '@/lib/components/ui/button'
import { Separator } from '@/lib/components/ui/separator'

type BreadcrumbItem = {
  title: string;
  href?: string;
}

type BreadcrumbMap = {
  [key: string]: {
    title: string;
  }
}

const breadcrumbMap: BreadcrumbMap = {
  '/dashboard': {
    title: 'Dashboard'
  },
  '/sites': {
    title: 'Sites'
  },
  '/value-streams': {
    title: 'Value Streams'
  },
  '/cells': {
    title: 'Cells'
  },
  '/metrics': {
    title: 'Metrics'
  },
  '/operators': {
    title: 'Operators'
  },
  '/settings': {
    title: 'Settings'
  }
}

export function DashboardHeader() {
  const { isOpen, isCollapsed, toggleSidebar, toggleCollapsed } = useSidebar()
  const pathname = usePathname()

  const breadcrumbs = React.useMemo(() => {
    if (!pathname) return [{ title: 'Dashboard' } as BreadcrumbItem]

    const segments = pathname.split('/').filter(segment => segment)
    let currentPath = ''

    return segments.map((segment, index) => {
      currentPath += `/${segment}`
      
      if (breadcrumbMap[currentPath]) {
        return {
          title: breadcrumbMap[currentPath].title,
          href: currentPath
        } as BreadcrumbItem
      }
      
      // If not in the map, generate a title from the segment
      const segmentTitle = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      return {
        title: segmentTitle,
        href: currentPath
      } as BreadcrumbItem
    })
  }, [pathname])

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div className="flex items-center">
        {/* Mobile sidebar toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="flex lg:hidden items-center justify-center"
        >
          {isOpen ? <PanelLeftIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </Button>
        
        {/* Desktop sidebar collapse toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex items-center justify-center"
        >
          {isCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      <nav className="flex items-center gap-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
            )}
            {breadcrumb.href ? (
              <Link
                href={breadcrumb.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {breadcrumb.title}
              </Link>
            ) : (
              <span className="text-sm font-medium">{breadcrumb.title}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </header>
  )
} 