import type { Request, Response } from 'express'
import { generateAccessToken } from '../utils/JwtUtils.js'
import {
  loginUser,
  requestPasswordReset,
  registerUser,
  resetPassword,
} from '../services/AuthService.js'
import {
  emailSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/AuthValidator.js'

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validationResult =
      registerSchema.safeParse(req.body)

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid registration data',
        errors:
          validationResult.error.flatten()
            .fieldErrors,
      })

      return
    }

    const user = await registerUser(
      validationResult.data,
    )

    res.status(201).json({
      success: true,
      message:
        user.role === 'teacher'
          ? 'Registration successful. Please verify your college email. Your account will require admin approval after verification.'
          : 'Registration successful. Please verify your college email.',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        isEmailVerified:
          user.isEmailVerified,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    console.error(
      'Registration failed:',
      error,
    )

    if (
      error instanceof Error &&
      (
        error.message ===
          'An account with this email already exists' ||
        error.message ===
          'This username is already taken'
      )
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      })

      return
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
    })
  }
}

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, rememberMe } =
      req.body ?? {}

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })

      return
    }

    const user = await loginUser(
      email.trim().toLowerCase(),
      password,
    )

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      rememberMe === true,
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      ...(rememberMe === true
        ? { maxAge: 30 * 24 * 60 * 60 * 1000 }
        : {}),
    })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved,
        isArchived: user.isArchived,
      },
    })
  } catch (error) {
    console.error('Login failed:', error)

    if (error instanceof Error) {
      const knownErrors = [
        'Invalid email or password',
        'This account has been archived',
        'Please verify your college email first',
        'Your teacher account is waiting for admin approval',
      ]

      if (knownErrors.includes(error.message)) {
        res.status(401).json({
          success: false,
          message: error.message,
        })

        return
      }

    }

    res.status(500).json({
      success: false,
      message: 'Login failed',
    })
  }
}

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const validationResult = emailSchema.safeParse(
    req.body,
  )

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'A valid college email is required',
    })
    return
  }

  try {
    await requestPasswordReset(
      validationResult.data.email,
    )
  } catch (error) {
    console.error('Password reset request failed:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to process password reset request',
    })
    return
  }

  res.status(200).json({
    success: true,
    message:
      'If an eligible account exists, a password reset email will be sent.',
  })
}

export const completePasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const validationResult =
    resetPasswordSchema.safeParse(req.body)

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'A valid reset token and password are required',
    })
    return
  }

  try {
    await resetPassword(
      validationResult.data.token,
      validationResult.data.password,
    )
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        'Password reset token is invalid or has expired'
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
      return
    }

    console.error('Password reset failed:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to reset password',
    })
    return
  }

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  })
}

export const logout = (
  _req: Request,
  res: Response,
): void => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? 'none'
        : 'lax',
  })

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
}