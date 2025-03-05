/*
<ai_context>
Initializes the database connection and schema for the app.
Updated to implement proper connection pooling to prevent "too many clients" errors.
</ai_context>
*/

import { profilesTable, contactsTable } from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env.local" })

const schema = {
  profiles: profilesTable,
  contacts: contactsTable
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections from growing exponentially
// during API Route usage.
let cachedClient: ReturnType<typeof postgres> | undefined

function getClient() {
  if (cachedClient) return cachedClient

  const connectionString = process.env.DATABASE_URL!

  // Connection options to limit the number of connections
  const options = {
    max: 10, // Set max pool size to 10
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10 // Connection timeout after 10 seconds
  }

  cachedClient = postgres(connectionString, options)

  return cachedClient
}

const client = getClient()
export const db = drizzle(client, { schema })
