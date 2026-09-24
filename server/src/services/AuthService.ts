import bcrypt from 'bcryptjs'
import User, { type UserRole } from '../models/User.js'
import EmailVerificationToken from '../models/EmailVerificationToken.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import {
  generateVerificationToken,
  hashToken,
} from '../utils/TokenUtils.js'
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from './EmailService.js'

const SALT_ROUNDS = 12
const TOKEN_TTL_MS = 15 * 60 * 1000

export const hashPassword = async (
  password: string,
): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

interface RegisterUserData {
  fullName: string
  username: string
  email: string
  password: string
  role: Extract<UserRole, 'student' | 'teacher'>
  collegeId?: string
  facultyId?: string
  department: string
  year?: number
}

export const registerUser = async (
  userData: RegisterUserData,
) => {
  const existingEmail = await User.findOne({
    email: userData.email,
  })

  if (existingEmail) {
    throw new Error(
      'An account with this email already exists',
    )
  }

  const existingUsername = await User.findOne({
    username: userData.username,
  })

  if (existingUsername) {
    throw new Error(
      'This username is already taken',
    )
  }

  const hashedPassword = await hashPassword(
    userData.password,
  )

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    isEmailVerified: false,
    isApproved: userData.role === 'student',
    isArchived: false,
  })

  const verificationToken = generateVerificationToken()
  const tokenHash = hashToken(verificationToken)

  try {
    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(
        Date.now() + TOKEN_TTL_MS,
      ),
    })
  } catch (error) {
    await User.deleteOne({ _id: user._id })
    throw error
  }

  try {
    await sendVerificationEmail(
      user.email,
      verificationToken,
    )
  } catch (error) {
    await EmailVerificationToken.deleteMany({
      userId: user._id,
    })
    await User.deleteOne({ _id: user._id })
    throw error
  }

  return user
}

export const resendVerificationEmail = async (
  email: string,
): Promise<void> => {
  const user = await User.findOne({
    email,
  })

  if (!user) {
    throw new Error(
      'No account found with this email',
    )
  }

  if (user.isEmailVerified) {
    throw new Error(
      'This email is already verified',
    )
  }

  await EmailVerificationToken.deleteMany({
    userId: user._id,
  })

  const verificationToken =
    generateVerificationToken()

  const tokenHash =
    hashToken(verificationToken)

  await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(
        Date.now() + TOKEN_TTL_MS,
      ),
    })

  try {
    await sendVerificationEmail(
      user.email,
      verificationToken,
    )
  } catch (error) {
    await EmailVerificationToken.deleteOne({
      userId: user._id,
      tokenHash,
    })
    throw error
  }
}

export const loginUser = async (
  email: string,
  password: string,
) => {
  const user = await User.findOne({
    email,
  })

  if (!user) {
    throw new Error(
      'Invalid email or password',
    )
  }

  if (user.isArchived) {
    throw new Error(
      'This account has been archived',
    )
  }

  if (!user.isEmailVerified) {
    throw new Error(
      'Please verify your college email first',
    )
  }

  if (
    user.role === 'teacher' &&
    !user.isApproved
  ) {
    throw new Error(
      'Your teacher account is waiting for admin approval',
    )
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password,
    )

  if (!isPasswordValid) {
    throw new Error(
      'Invalid email or password',
    )
  }

  return user
}

export const requestPasswordReset = async (
  email: string,
): Promise<void> => {
  const user = await User.findOne({
    email,
    isArchived: false,
  })

  if (!user) {
    return
  }

  await PasswordResetToken.deleteMany({
    userId: user._id,
  })

  const resetToken = generateVerificationToken()
  const tokenHash = hashToken(resetToken)

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  })

  try {
    await sendPasswordResetEmail(
      user.email,
      resetToken,
    )
  } catch (error) {
    await PasswordResetToken.deleteOne({
      userId: user._id,
      tokenHash,
    })
    throw error
  }
}

export const resetPassword = async (
  token: string,
  password: string,
): Promise<void> => {
  const resetToken = await PasswordResetToken.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  })

  if (!resetToken) {
    throw new Error(
      'Password reset token is invalid or has expired',
    )
  }

  const user = await User.findById(resetToken.userId)

  if (!user || user.isArchived) {
    throw new Error(
      'Password reset token is invalid or has expired',
    )
  }

  user.password = await hashPassword(password)
  await user.save()
  await PasswordResetToken.deleteMany({
    userId: user._id,
  })
}