'use server'

/*
<ai_context>
Profile management server actions.
Handles user profile creation and retrieval.
Integrates with Clerk for authentication and user management.
</ai_context>
*/

import { auth, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db/db'
import { profilesTable, SelectProfile, InsertProfile } from '@/db/schema/profiles'

// Action response type
type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Gets the current user's profile, creating it if it doesn't exist
 */
export async function getOrCreateProfile(): Promise<ActionResponse<SelectProfile>> {
  try {
    const user = await currentUser()
    
    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to access your profile',
      }
    }

    const userId = user.id
    let organizationId = null
    
    // Get active organization if it exists
    const activeOrg = user.organizationMemberships?.find(
      membership => membership.organization.id === user.primaryOrganizationId
    )
    
    if (activeOrg) {
      organizationId = activeOrg.organization.id
    }

    // Check if profile exists
    let profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId),
    })

    // If not, create it
    if (!profile) {
      try {
        // Create a new profile
        const [newProfile] = await db
          .insert(profilesTable)
          .values({
            userId,
            organizationId,
            // Default role is 'operator' as defined in the schema
          })
          .returning()
        
        profile = newProfile
      } catch (error) {
        console.error('Error creating profile:', error)
        return {
          success: false,
          message: 'Failed to create profile',
        }
      }
    } else if (organizationId && profile.organizationId !== organizationId) {
      // Update organization ID if it has changed
      try {
        const [updatedProfile] = await db
          .update(profilesTable)
          .set({ organizationId })
          .where(eq(profilesTable.userId, userId))
          .returning()
          
        profile = updatedProfile
      } catch (error) {
        console.error('Error updating profile organization:', error)
      }
    }

    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    }
  } catch (error) {
    console.error('Error getting or creating profile:', error)
    return {
      success: false,
      message: 'Failed to get or create profile',
    }
  }
}

/**
 * Gets a profile by user ID
 */
export async function getProfileByUserId(userId: string): Promise<ActionResponse<SelectProfile>> {
  try {
    // Validate the current user has permission to view this profile
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to view profiles',
      }
    }

    const currentUserId = user.id

    // For now, only allow users to view their own profiles
    // In the future, we could add permission checks for admins/supervisors
    if (currentUserId !== userId) {
      const currentUserProfile = await db.query.profiles.findFirst({
        where: eq(profilesTable.userId, currentUserId),
      })

      // Only admins and supervisors can view other profiles
      if (!currentUserProfile || !['admin', 'supervisor'].includes(currentUserProfile.role || '')) {
        return {
          success: false,
          message: 'You do not have permission to view this profile',
        }
      }
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId),
    })

    if (!profile) {
      return {
        success: false,
        message: 'Profile not found',
      }
    }

    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    }
  } catch (error) {
    console.error('Error getting profile by user id:', error)
    return {
      success: false,
      message: 'Failed to retrieve profile',
    }
  }
}

/**
 * Updates the current user's profile
 */
export async function updateProfileAction(
  data: Partial<Omit<InsertProfile, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<ActionResponse<SelectProfile>> {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        success: false,
        message: 'You must be logged in to update your profile',
      }
    }

    const userId = user.id

    // Check if role is being updated
    if (data.role && data.role !== 'operator') {
      // Only admins can promote users
      const currentProfile = await db.query.profiles.findFirst({
        where: eq(profilesTable.userId, userId),
      })

      if (!currentProfile || currentProfile.role !== 'admin') {
        // Remove role from data
        delete data.role
      }
    }
    
    // Update the profile
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      message: 'Failed to update profile',
    }
  }
}

/**
 * Associates a user with a company and optionally sets a site and value stream
 */
export async function associateUserWithCompanyAction(
  userId: string,
  companyId: string,
  data: {
    role?: 'admin' | 'supervisor' | 'operator'
    primarySiteId?: string
    primaryValueStreamId?: string
  }
): Promise<ActionResponse<SelectProfile>> {
  try {
    // Verify the current user has admin rights for this company
    const { userId: currentUserId } = auth()

    if (!currentUserId) {
      return {
        success: false,
        message: 'You must be logged in to associate users with a company',
      }
    }

    const adminProfile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, currentUserId),
    })

    if (
      !adminProfile ||
      adminProfile.companyId !== companyId ||
      adminProfile.role !== 'admin'
    ) {
      return {
        success: false,
        message: 'You must be an admin of this company to add users',
      }
    }

    // Update the user's profile
    const [updatedProfile] = await db
      .update(profilesTable)
      .set({
        companyId,
        role: data.role || 'operator',
        primarySiteId: data.primarySiteId,
        primaryValueStreamId: data.primaryValueStreamId,
      })
      .where(eq(profilesTable.userId, userId))
      .returning()

    return {
      success: true,
      message: 'User associated with company successfully',
      data: updatedProfile,
    }
  } catch (error) {
    console.error('Error associating user with company:', error)
    return {
      success: false,
      message: 'Failed to associate user with company',
    }
  }
} 