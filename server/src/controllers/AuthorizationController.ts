import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/AuthMiddleware.js'

const capabilitiesByRole = {
  student: [
    'profile:read',
    'profile:edit',
    'article:create',
    'article:edit-own',
  ],
  teacher: [
    'profile:read',
    'profile:edit',
    'article:create',
    'article:edit-own',
  ],
  reviewer: [
    'profile:read',
    'review:claim',
    'review:manage',
  ],
  admin: [
    'profile:read',
    'profile:edit',
    'article:manage',
    'review:manage',
    'user:manage',
    'system:manage',
  ],
} as const

export const getAuthorizationContext = (
  req: AuthenticatedRequest,
  res: Response,
): void => {
  if (!req.currentUser) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  res.status(200).json({
    success: true,
    user: req.currentUser,
    capabilities: capabilitiesByRole[req.currentUser.role],
  })
}
