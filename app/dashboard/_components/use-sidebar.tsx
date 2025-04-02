'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Local storage keys
const SIDEBAR_OPEN_KEY = 'dashboard-sidebar-open'
const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed'

export function SidebarProvider({
  children,
  defaultOpen = true,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}) {
  // Initialize states with localStorage values if available
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  
  // Load saved preferences on first render
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const savedOpenState = localStorage.getItem(SIDEBAR_OPEN_KEY)
      if (savedOpenState !== null) {
        setIsOpen(savedOpenState === 'true')
      }
      
      const savedCollapsedState = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (savedCollapsedState !== null) {
        setIsCollapsed(savedCollapsedState === 'true')
      }
    }
  }, [])
  
  // Save to localStorage when states change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_OPEN_KEY, isOpen.toString())
    }
  }, [isOpen])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed.toString())
    }
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const setSidebarOpen = (open: boolean) => {
    setIsOpen(open)
  }
  
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }
  
  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        isCollapsed, 
        toggleSidebar, 
        setSidebarOpen, 
        toggleCollapsed, 
        setCollapsed 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  
  return context
} 