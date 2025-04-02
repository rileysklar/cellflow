/*
<ai_context>
Defines the database schema for user profiles.
Uses Clerk for user authentication and organizations.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { companiesTable } from './companies'

// Roles enum for manufacturing roles
export const roleEnum = pgEnum('role', ['admin', 'supervisor', 'operator'])

export const profilesTable = pgTable('profiles', {
  userId: text('user_id').primaryKey().notNull(), // Clerk user ID
  organizationId: text('organization_id'), // Clerk organization ID
  
  // Company and role
  companyId: uuid('company_id').references(() => companiesTable.id),
  role: roleEnum('role').default('operator'),
  
  // Site and value stream
  primarySiteId: uuid('primary_site_id'),
  primaryValueStreamId: uuid('primary_value_stream_id'),
  
  // Operator specific data
  title: text('title'),
  department: text('department'),
  employeeId: text('employee_id'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect
