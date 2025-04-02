/*
<ai_context>
Initializes the database connection and schema for the app.
Updated to implement proper connection pooling to prevent "too many clients" errors.
Updated to use Clerk organizations for the manufacturing efficiency tracking system.
</ai_context>
*/

import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Import schemas
import { profilesTable } from '@/db/schema/profiles'
import { sitesTable } from '@/db/schema/sites'

config({ path: '.env.local' })

const schema = {
  profiles: profilesTable,
  sites: sitesTable,
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections from growing exponentially
// during API Route usage.
let cachedClient: ReturnType<typeof postgres> | undefined

function getClient() {
  if (cachedClient) return cachedClient

  const connectionString = process.env.DATABASE_URL!

  const options = {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  }

  cachedClient = postgres(connectionString, options)

  return cachedClient
}

const client = getClient()
export const db = drizzle(client, { schema })
