import jwt from 'jsonwebtoken'
import type { UserRole } from '../models/User.js'

interface JwtPayload {
  userId: string
  role: UserRole
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error(
      'JWT_SECRET is not configured',
    )
  }

  return secret
}

export const generateAccessToken = (
  userId: string,
  role: UserRole,
  rememberMe = false,
): string => {
  const payload: JwtPayload = {
    userId,
    role,
  }

  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: rememberMe
        ? '30d'
        : ((process.env.JWT_EXPIRES_IN ||
            '1d') as jwt.SignOptions['expiresIn']),
    },
  )
}

export const verifyAccessToken = (
  token: string,
): JwtPayload => {
  const decoded = jwt.verify(
    token,
    getJwtSecret(),
  )

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.userId !== 'string' ||
    typeof decoded.role !== 'string'
  ) {
    throw new Error('Invalid authentication token')
  }

  return {
    userId: decoded.userId,
    role: decoded.role as UserRole,
  }
}