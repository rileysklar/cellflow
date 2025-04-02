/*
<ai_context>
Defines the database schema for sites.
Sites are manufacturing facilities within a Clerk organization.
</ai_context>
*/

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const sitesTable = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(), // Clerk organization ID
  name: text('name').notNull(),
  location: text('location'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertSite = typeof sitesTable.$inferInsert
export type SelectSite = typeof sitesTable.$inferSelect 