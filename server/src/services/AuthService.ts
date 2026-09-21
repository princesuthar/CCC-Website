import bcrypt from 'bcryptjs'
import User, { type UserRole } from '../models/User.js'
import EmailVerificationToken from '../models/EmailVerificationToken.js'
import {
  generateVerificationToken,
  hashToken,
} from '../utils/TokenUtils.js'
import { sendVerificationEmail } from './EmailService.js'

const SALT_ROUNDS = 12

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

  await EmailVerificationToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(
      Date.now() + 15 * 60 * 1000,
    ),
  })

  await sendVerificationEmail(
    user.email,
    verificationToken,
  )

  return {
    user,
    verificationToken,
  }
}