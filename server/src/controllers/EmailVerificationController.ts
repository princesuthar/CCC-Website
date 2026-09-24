import type { Request, Response } from 'express'
import EmailVerificationToken from '../models/EmailVerificationToken.js'
import User from '../models/User.js'
import {
  resendVerificationEmail,
} from '../services/AuthService.js'
import { hashToken } from '../utils/TokenUtils.js'

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.query.token

    if (typeof token !== 'string' || !token.trim()) {
      res.status(400).json({
        success: false,
        message: 'Verification token is required',
      })

      return
    }

    const tokenHash = hashToken(token)

    const verificationToken =
      await EmailVerificationToken.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
      })

    if (!verificationToken) {
      res.status(400).json({
        success: false,
        message: 'Verification token is invalid or has expired',
      })

      return
    }

    const user = await User.findById(
      verificationToken.userId,
    )

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User account not found',
      })

      return
    }

    if (user.isEmailVerified) {
      await EmailVerificationToken.deleteOne({
        _id: verificationToken._id,
      })

      res.status(200).json({
        success: true,
        message: 'Email is already verified',
      })

      return
    }

    user.isEmailVerified = true

    await user.save()

    await EmailVerificationToken.deleteOne({
      _id: verificationToken._id,
    })

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Email verification failed:', error)

    res.status(500).json({
      success: false,
      message: 'Email verification failed',
    })
  }
}

export const resendVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const email = req.body?.email

    if (
      typeof email !== 'string' ||
      !email.trim()
    ) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      })

      return
    }

    await resendVerificationEmail(
      email.trim().toLowerCase(),
    )

    res.status(200).json({
      success: true,
      message:
        'A new verification email has been sent.',
    })
  } catch (error) {
    console.error(
      'Resend verification failed:',
      error,
    )

    if (
      error instanceof Error &&
      (error.message ===
        'No account found with this email' ||
        error.message ===
          'This email is already verified')
    ) {
      res.status(200).json({
        success: true,
        message:
          'If an eligible account exists, a verification email will be sent.',
      })
      return
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
    })
  }
}