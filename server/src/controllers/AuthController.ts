import type { Request, Response } from 'express'
import {
  registerUser,
} from '../services/AuthService.js'
import { registerSchema } from '../validators/AuthValidator.js'

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid registration data',
        errors: validationResult.error.flatten().fieldErrors,
      })

      return
    }

    const { user } = await registerUser(validationResult.data)

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
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved,
      },
    })
  } catch (error) {
    console.error('Registration failed:', error)

    if (
      error instanceof Error &&
      (error.message === 'An account with this email already exists' ||
        error.message === 'This username is already taken')
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