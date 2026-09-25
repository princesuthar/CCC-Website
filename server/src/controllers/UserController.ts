import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/AuthMiddleware.js'
import User from '../models/User.js'

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user = await User.findById(req.user?.userId).select(
    '-password',
  )

  if (!user || user.isArchived) {
    res.status(404).json({
      success: false,
      message: 'User account not found',
    })
    return
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      collegeId: user.collegeId,
      facultyId: user.facultyId,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      socialLinks: user.socialLinks,
      isEmailVerified: user.isEmailVerified,
      isApproved: user.isApproved,
      isArchived: user.isArchived,
    },
  })
}