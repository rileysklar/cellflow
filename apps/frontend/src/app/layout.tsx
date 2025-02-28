import { type Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CellFlow - Manufacturing Efficiency',
  description: 'Manufacturing Efficiency Tracking System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.variable} font-sans antialiased min-h-full`}>
          <div className="min-h-full bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                      CellFlow
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <SignedIn>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                          <div>
                            <div className="font-medium">Acme Inc</div>
                            <div className="text-xs text-gray-500">Main Factory</div>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard">Overview</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/value-stream">Value Stream</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/cell">Cell</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/operator">Operator</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Project Info</DropdownMenuLabel>
                          <div className="px-2 py-1.5">
                            <div className="text-sm font-medium">Company: Acme Inc</div>
                            <div className="text-xs text-gray-500">Site: Main Factory</div>
                            <div className="text-xs text-gray-500">Project: Manufacturing Line A</div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-3 py-2 text-sm font-medium rounded-md"
                      >
                        Sign up
                      </Link>
                    </SignedOut>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 rounded-full",
                          userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </nav>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}