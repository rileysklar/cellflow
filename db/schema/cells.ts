/*
<ai_context>
Defines the database schema for cells.
Cells are workstations or specific manufacturing processes within a value stream.
</ai_context>
*/

import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'
import { valueStreamsTable } from './value-streams'

export const cellsTable = pgTable('cells', {
  id: uuid('id').defaultRandom().primaryKey(),
  valueStreamId: uuid('value_stream_id')
    .notNull()
    .references(() => valueStreamsTable.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull(), // Clerk organization ID for direct queries
  name: text('name').notNull(),
  description: text('description'),
  standardCycleTime: integer('standard_cycle_time').notNull(), // stored in seconds
  machineCount: integer('machine_count').default(1).notNull(),
  operatorCount: integer('operator_count').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertCell = typeof cellsTable.$inferInsert
export type SelectCell = typeof cellsTable.$inferSelect 