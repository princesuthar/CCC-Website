import type { Request, Response } from 'express'
import EmailVerificationToken from '../models/EmailVerificationToken.js'
import User from '../models/User.js'
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