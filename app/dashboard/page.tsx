'use client'

import { UserButton, useOrganization, useUser } from '@clerk/nextjs'
import { Button } from '@/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useUser()
  const { organization } = useOrganization()
  const router = useRouter()

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manufacturing Dashboard</h1>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sites</CardTitle>
            <CardDescription>Manage your manufacturing sites</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and manage all manufacturing facilities</p>
            <Button asChild className="w-full">
              <Link href="/sites">View Sites</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Value Streams</CardTitle>
            <CardDescription>Manage production value streams</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Configure and monitor value streams</p>
            <Button asChild className="w-full">
              <Link href="/value-streams">View Value Streams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cells</CardTitle>
            <CardDescription>Manage production cells</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Configure and track efficiency of work cells</p>
            <Button asChild className="w-full">
              <Link href="/cells">View Cells</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Organization: {organization?.name || 'No Organization Selected'}</h2>
        <p className="text-muted-foreground mb-2">
          {organization
            ? 'You are currently viewing data for this organization.'
            : 'Please create or select an organization to view manufacturing data.'}
        </p>
        {!organization && (
          <Button onClick={() => router.push('/org-selection')}>
            Manage Organizations
          </Button>
        )}
      </div>
    </div>
  )
} 