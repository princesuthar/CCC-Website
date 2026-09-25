import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/AuthMiddleware.js'
import {
  archiveProfile,
  getPublicProfile,
  toPublicProfile,
  updateProfile,
} from '../services/ProfileService.js'
import { updateProfileSchema } from '../validators/ProfileValidator.js'
import { uploadProfilePhoto } from '../services/CloudinaryService.js'

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const result = await getPublicProfile(
    typeof req.params.username === 'string'
      ? req.params.username
      : '',
  )

  if (!result) {
    res.status(404).json({
      success: false,
      message: 'Profile not found',
    })
    return
  }

  if (result.redirectUsername) {
    res.redirect(
      301,
      `/api/profiles/u/${result.redirectUsername}`,
    )
    return
  }

  res.status(200).json({
    success: true,
    profile: result.profile,
  })
}

export const updateCurrentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const validationResult =
    updateProfileSchema.safeParse(req.body)

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid profile data',
      errors: validationResult.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const user = await updateProfile(
      req.user!.userId,
      validationResult.data,
    )

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: toPublicProfile(user),
    })
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'This username is already taken' ||
        error.message === 'User account not found')
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      })
      return
    }

    throw error
  }
}

export const archiveCurrentProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  await archiveProfile(req.user!.userId)
  res.status(200).json({
    success: true,
    message: 'Account archived successfully',
  })
}

export const uploadCurrentProfilePhoto = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const file = req.file

  if (!file) {
    res.status(400).json({
      success: false,
      message: 'A profile image is required',
    })
    return
  }

  const profilePhoto = await uploadProfilePhoto(
    file.buffer,
    file.mimetype,
  )

  const user = await updateProfile(
    req.user!.userId,
    { profilePhoto },
  )

  res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully',
    profilePhoto: user.profilePhoto,
  })
}
