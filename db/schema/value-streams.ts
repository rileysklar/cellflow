/*
<ai_context>
Defines the database schema for value streams.
Value streams are production lines or processes within a manufacturing site.
</ai_context>
*/

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sitesTable } from './sites'

export const valueStreamsTable = pgTable('value_streams', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id')
    .notNull()
    .references(() => sitesTable.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull(), // Clerk organization ID for direct queries
  name: text('name').notNull(),
  description: text('description'),
  targetCycleTime: text('target_cycle_time'), // stored as string in format HH:MM:SS
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertValueStream = typeof valueStreamsTable.$inferInsert
export type SelectValueStream = typeof valueStreamsTable.$inferSelect 