import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/JwtUtils.js'
import type { UserRole } from '../models/User.js'
import User from '../models/User.js'

export interface AuthenticatedRequest
  extends Request {
  user?: {
    userId: string
    role: UserRole
  }
  currentUser?: {
    userId: string
    role: UserRole
    isEmailVerified: boolean
    isApproved: boolean
  }
}

const USER_ROLES: readonly UserRole[] = [
  'student',
  'teacher',
  'reviewer',
  'admin',
]

export const isUserRole = (
  role: string,
): role is UserRole => USER_ROLES.includes(
  role as UserRole,
)

export const hasRequiredRole = (
  role: UserRole,
  allowedRoles: readonly UserRole[],
): boolean => allowedRoles.includes(role)

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies?.accessToken

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })

      return
    }

    const payload = verifyAccessToken(token)

    if (!isUserRole(payload.role)) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      })

      return
    }

    req.user = {
      userId: payload.userId,
      role: payload.role,
    }

    next()
  } catch (error) {
    console.error(
      'Authentication failed:',
      error,
    )

    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}

export const authorizeRoles = (
  ...allowedRoles: UserRole[]
) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  if (!hasRequiredRole(req.user.role, allowedRoles)) {
    res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource',
    })
    return
  }

  next()
}

export const requireActiveUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  try {
    const user = await User.findById(req.user.userId).select(
      '_id role isEmailVerified isApproved isArchived',
    )

    if (!user || user.isArchived) {
      res.status(401).json({
        success: false,
        message: 'User account is unavailable',
      })
      return
    }

    if (!isUserRole(user.role)) {
      res.status(401).json({
        success: false,
        message: 'User account has an invalid role',
      })
      return
    }

    req.user.role = user.role
    req.currentUser = {
      userId: user._id.toString(),
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isApproved: user.isApproved,
    }

    next()
  } catch (error) {
    next(error)
  }
}
