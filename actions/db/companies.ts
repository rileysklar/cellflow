'use server'

/*
<ai_context>
Company management server actions.
Handles company creation, retrieval, updating, and deletion.
Integrates with Clerk for authentication and user management.
</ai_context>
*/

import { auth } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

import { db } from '@/db/db'
import { companiesTable, InsertCompany, SelectCompany } from '@/db/schema/companies'
import { profilesTable } from '@/db/schema/profiles'
import { ActionState } from '@/types/server-action'

// Action response type
type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Creates a new company and associates it with the current user
 */
export async function createCompanyAction(
  data: Omit<InsertCompany, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>
): Promise<ActionState<SelectCompany>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return {
        isSuccess: false,
        message: 'You must be logged in to create a company',
      }
    }

    // Start a transaction to ensure both operations succeed or fail together
    const company = await db.transaction(async (tx) => {
      // Create the company
      const [newCompany] = await tx
        .insert(companiesTable)
        .values({
          ...data,
          createdBy: userId,
        })
        .returning()

      // Associate the user with the company and make them an admin
      await tx.update(profilesTable)
        .set({
          companyId: newCompany.id,
          role: 'admin',
        })
        .where(eq(profilesTable.userId, userId))

      return newCompany
    })

    return {
      isSuccess: true,
      message: 'Company created successfully',
      data: company,
    }
  } catch (error) {
    console.error('Error creating company:', error)
    return {
      isSuccess: false,
      message: 'Failed to create company',
    }
  }
}

/**
 * Gets a company by ID
 */
export async function getCompanyAction(id: string): Promise<ActionState<SelectCompany>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return {
        isSuccess: false,
        message: 'You must be logged in to view company details',
      }
    }

    const company = await db.query.companies.findFirst({
      where: eq(companiesTable.id, id),
    })

    if (!company) {
      return {
        isSuccess: false,
        message: 'Company not found',
      }
    }

    // Check if user has access to this company
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId),
    })

    if (!profile || profile.companyId !== company.id) {
      return {
        isSuccess: false,
        message: 'You do not have access to this company',
      }
    }

    return {
      isSuccess: true,
      message: 'Company retrieved successfully',
      data: company,
    }
  } catch (error) {
    console.error('Error retrieving company:', error)
    return {
      isSuccess: false,
      message: 'Failed to retrieve company',
    }
  }
}

/**
 * Gets all companies created by or accessible to the current user
 */
export async function getUserCompaniesAction(): Promise<ActionState<SelectCompany[]>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return {
        isSuccess: false,
        message: 'You must be logged in to view companies',
      }
    }

    // Get the user's profile to check which company they're associated with
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId),
    })

    if (!profile || !profile.companyId) {
      // User hasn't been associated with a company yet
      // Check if they've created any companies
      const createdCompanies = await db.query.companies.findMany({
        where: eq(companiesTable.createdBy, userId),
        orderBy: [desc(companiesTable.createdAt)],
      })

      return {
        isSuccess: true,
        message: 'Companies retrieved successfully',
        data: createdCompanies,
      }
    }

    // Get the company they're associated with
    const company = await db.query.companies.findFirst({
      where: eq(companiesTable.id, profile.companyId),
    })

    return {
      isSuccess: true,
      message: 'Company retrieved successfully',
      data: company ? [company] : [],
    }
  } catch (error) {
    console.error('Error retrieving companies:', error)
    return {
      isSuccess: false,
      message: 'Failed to retrieve companies',
    }
  }
}

/**
 * Updates a company by ID
 */
export async function updateCompanyAction(
  id: string,
  data: Partial<Omit<InsertCompany, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<ActionState<SelectCompany>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return {
        isSuccess: false,
        message: 'You must be logged in to update a company',
      }
    }

    // Check if the company exists and the user has permission to update it
    const company = await db.query.companies.findFirst({
      where: eq(companiesTable.id, id),
    })

    if (!company) {
      return {
        isSuccess: false,
        message: 'Company not found',
      }
    }

    // Only the creator or an admin can update the company
    if (company.createdBy !== userId) {
      const profile = await db.query.profiles.findFirst({
        where: eq(profilesTable.userId, userId),
      })

      if (!profile || profile.companyId !== id || profile.role !== 'admin') {
        return {
          isSuccess: false,
          message: 'You do not have permission to update this company',
        }
      }
    }

    // Update the company
    const [updatedCompany] = await db
      .update(companiesTable)
      .set(data)
      .where(eq(companiesTable.id, id))
      .returning()

    return {
      isSuccess: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    }
  } catch (error) {
    console.error('Error updating company:', error)
    return {
      isSuccess: false,
      message: 'Failed to update company',
    }
  }
}

/**
 * Deletes a company by ID
 */
export async function deleteCompanyAction(id: string): Promise<ActionState<void>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return {
        isSuccess: false,
        message: 'You must be logged in to delete a company',
      }
    }

    // Check if the company exists and the user has permission to delete it
    const company = await db.query.companies.findFirst({
      where: eq(companiesTable.id, id),
    })

    if (!company) {
      return {
        isSuccess: false,
        message: 'Company not found',
      }
    }

    // Only the creator can delete the company
    if (company.createdBy !== userId) {
      return {
        isSuccess: false,
        message: 'Only the company creator can delete it',
      }
    }

    // Delete the company
    await db.delete(companiesTable).where(eq(companiesTable.id, id))

    return {
      isSuccess: true,
      message: 'Company deleted successfully',
      data: undefined,
    }
  } catch (error) {
    console.error('Error deleting company:', error)
    return {
      isSuccess: false,
      message: 'Failed to delete company',
    }
  }
}

/**
 * Gets or creates a company for the active organization
 */
export async function getOrCreateCompanyFromOrganization(): Promise<ActionResponse<SelectCompany>> {
  try {
    const user = await currentUser()
    
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to access company data',
      }
    }

    // Get active organization
    const activeOrg = user.organizationMemberships?.find(
      membership => membership.organization.id === user.primaryOrganizationId
    )
    
    if (!activeOrg) {
      return {
        success: false,
        message: 'You must have an active organization',
      }
    }

    const organizationId = activeOrg.organization.id
    const organizationName = activeOrg.organization.name

    // Check if company exists for this organization
    let company = await db.query.companies.findFirst({
      where: eq(companiesTable.organizationId, organizationId),
    })

    // If not, create it
    if (!company) {
      try {
        // Create a new company based on organization
        const [newCompany] = await db
          .insert(companiesTable)
          .values({
            organizationId,
            name: organizationName,
          })
          .returning()
        
        company = newCompany
      } catch (error) {
        console.error('Error creating company:', error)
        return {
          success: false,
          message: 'Failed to create company',
        }
      }
    } else if (company.name !== organizationName) {
      // Update company name if organization name has changed
      try {
        const [updatedCompany] = await db
          .update(companiesTable)
          .set({ name: organizationName })
          .where(eq(companiesTable.organizationId, organizationId))
          .returning()
          
        company = updatedCompany
      } catch (error) {
        console.error('Error updating company name:', error)
      }
    }

    return {
      success: true,
      message: 'Company retrieved successfully',
      data: company,
    }
  } catch (error) {
    console.error('Error getting or creating company:', error)
    return {
      success: false,
      message: 'Failed to get or create company',
    }
  }
}

/**
 * Updates company details
 */
export async function updateCompany(
  data: Partial<Omit<InsertCompany, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>>
): Promise<ActionResponse<SelectCompany>> {
  try {
    const user = await currentUser()
    
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to update company details',
      }
    }

    // Get active organization
    const activeOrg = user.organizationMemberships?.find(
      membership => membership.organization.id === user.primaryOrganizationId
    )
    
    if (!activeOrg) {
      return {
        success: false,
        message: 'You must have an active organization',
      }
    }

    const organizationId = activeOrg.organization.id

    // Get company ID
    const company = await db.query.companies.findFirst({
      where: eq(companiesTable.organizationId, organizationId),
    })

    if (!company) {
      return {
        success: false,
        message: 'Company not found',
      }
    }

    // Update company details
    const [updatedCompany] = await db
      .update(companiesTable)
      .set(data)
      .where(eq(companiesTable.id, company.id))
      .returning()

    return {
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    }
  } catch (error) {
    console.error('Error updating company:', error)
    return {
      success: false,
      message: 'Failed to update company',
    }
  }
} 