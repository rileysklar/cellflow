/*
<ai_context>
Defines the database schema for machine cycles.
Machine cycles track the efficiency and performance data for manufacturing cells.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core'
import { cellsTable } from './cells'

// Create an enum for cycle status
export const cycleStatusEnum = pgEnum('cycle_status', ['completed', 'interrupted', 'maintenance', 'setup'])

export const machineCyclesTable = pgTable('machine_cycles', {
  id: uuid('id').defaultRandom().primaryKey(),
  cellId: uuid('cell_id')
    .notNull()
    .references(() => cellsTable.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull(), // Clerk organization ID for direct queries
  operatorId: text('operator_id').notNull(), // Clerk user ID of the operator
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  actualCycleTime: integer('actual_cycle_time'), // in seconds
  status: cycleStatusEnum('status').notNull().default('completed'),
  isEfficient: boolean('is_efficient'), // Automatically calculated based on standard vs actual time
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertMachineCycle = typeof machineCyclesTable.$inferInsert
export type SelectMachineCycle = typeof machineCyclesTable.$inferSelect 