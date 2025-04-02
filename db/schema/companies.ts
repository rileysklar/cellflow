/*
<ai_context>
Defines the database schema for companies.
Companies are associated with Clerk organizations.
</ai_context>
*/

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const companiesTable = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Clerk organization ID
  organizationId: text('organization_id').notNull().unique(),
  
  // Company details
  name: text('name').notNull(),
  description: text('description'),
  industry: text('industry'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertCompany = typeof companiesTable.$inferInsert
export type SelectCompany = typeof companiesTable.$inferSelect 