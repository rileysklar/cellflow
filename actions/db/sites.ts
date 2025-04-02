'use server'

/*
<ai_context>
Site management server actions.
Handles site creation and retrieval.
Integrates with Clerk for organization-based access control.
</ai_context>
*/

import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db/db'
import { sitesTable, InsertSite, SelectSite } from '@/db/schema/sites'

// Action response type
type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Creates a new site for the active organization
 */
export async function createSite(
  organizationId: string,
  data: Omit<InsertSite, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>
): Promise<ActionResponse<SelectSite>> {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to create a site',
      }
    }

    // Create the site
    const [newSite] = await db
      .insert(sitesTable)
      .values({
        ...data,
        organizationId,
      })
      .returning()

    return {
      success: true,
      message: 'Site created successfully',
      data: newSite,
    }
  } catch (error) {
    console.error('Error creating site:', error)
    return {
      success: false,
      message: 'Failed to create site',
    }
  }
}

/**
 * Gets sites for a specific organization
 */
export async function getOrganizationSites(organizationId: string): Promise<ActionResponse<SelectSite[]>> {
  try {
    // Get sites for this organization
    const sites = await db.query.sites.findMany({
      where: eq(sitesTable.organizationId, organizationId),
      orderBy: (sites, { asc }) => [asc(sites.name)],
    })

    return {
      success: true,
      message: 'Sites retrieved successfully',
      data: sites,
    }
  } catch (error) {
    console.error('Error retrieving organization sites:', error)
    return {
      success: false,
      message: 'Failed to retrieve sites',
    }
  }
}

/**
 * Gets a site by ID if it belongs to the current active organization
 */
export async function getSiteAction(id: string): Promise<ActionResponse<SelectSite>> {
  try {
    const { orgId } = auth()

    if (!orgId) {
      return {
        success: false,
        message: 'You must have an active organization to view sites',
      }
    }

    const site = await db.query.sites.findFirst({
      where: (sites, { and, eq }) => and(
        eq(sites.id, id),
        eq(sites.organizationId, orgId)
      ),
    })

    if (!site) {
      return {
        success: false,
        message: 'Site not found or does not belong to your active organization',
      }
    }

    return {
      success: true,
      message: 'Site retrieved successfully',
      data: site,
    }
  } catch (error) {
    console.error('Error retrieving site:', error)
    return {
      success: false,
      message: 'Failed to retrieve site',
    }
  }
}

/**
 * Updates a site if it belongs to the current active organization
 */
export async function updateSiteAction(
  id: string,
  data: Partial<Omit<InsertSite, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>>
): Promise<ActionResponse<SelectSite>> {
  try {
    const { orgId } = auth()
    const user = await currentUser()

    if (!user || !orgId) {
      return {
        success: false,
        message: 'You must be logged in and have an active organization to update a site',
      }
    }

    // Check if the site exists and belongs to the current organization
    const site = await db.query.sites.findFirst({
      where: (sites, { and, eq }) => and(
        eq(sites.id, id),
        eq(sites.organizationId, orgId)
      ),
    })

    if (!site) {
      return {
        success: false,
        message: 'Site not found or does not belong to your active organization',
      }
    }

    // Check if the user has permission to update sites in this org
    const orgMembership = user.organizationMemberships?.find(
      (membership) => membership.organization.id === orgId
    )

    if (!orgMembership || !['admin', 'basic_member'].includes(orgMembership.role)) {
      return {
        success: false,
        message: 'You do not have permission to update sites in this organization',
      }
    }

    // Update the site
    const [updatedSite] = await db
      .update(sitesTable)
      .set(data)
      .where(eq(sitesTable.id, id))
      .returning()

    return {
      success: true,
      message: 'Site updated successfully',
      data: updatedSite,
    }
  } catch (error) {
    console.error('Error updating site:', error)
    return {
      success: false,
      message: 'Failed to update site',
    }
  }
}

/**
 * Deletes a site if it belongs to the current active organization
 */
export async function deleteSiteAction(id: string): Promise<ActionResponse<void>> {
  try {
    const { orgId } = auth()
    const user = await currentUser()

    if (!user || !orgId) {
      return {
        success: false,
        message: 'You must be logged in and have an active organization to delete a site',
      }
    }

    // Check if the site exists and belongs to the current organization
    const site = await db.query.sites.findFirst({
      where: (sites, { and, eq }) => and(
        eq(sites.id, id),
        eq(sites.organizationId, orgId)
      ),
    })

    if (!site) {
      return {
        success: false,
        message: 'Site not found or does not belong to your active organization',
      }
    }

    // Check if the user has permission to delete sites in this org
    const orgMembership = user.organizationMemberships?.find(
      (membership) => membership.organization.id === orgId
    )

    if (!orgMembership || !['admin'].includes(orgMembership.role)) {
      return {
        success: false,
        message: 'You do not have permission to delete sites in this organization',
      }
    }

    // Delete the site
    await db.delete(sitesTable).where(eq(sitesTable.id, id))

    return {
      success: true,
      message: 'Site deleted successfully',
      data: undefined,
    }
  } catch (error) {
    console.error('Error deleting site:', error)
    return {
      success: false,
      message: 'Failed to delete site',
    }
  }
} 