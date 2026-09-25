import User from '../models/User.js'
import UsernameHistory from '../models/UsernameHistory.js'
import type { UpdateProfileInput } from '../validators/ProfileValidator.js'

const publicProfileProjection = {
  password: 0,
  email: 0,
  collegeId: 0,
  facultyId: 0,
  isEmailVerified: 0,
  isApproved: 0,
  isArchived: 0,
  __v: 0,
}

export const toPublicProfile = (
  user: {
    _id: { toString(): string }
    fullName: string
    username: string
    role: string
    department: string
    year?: number
    profilePhoto?: string
    bio?: string
    socialLinks?: Record<string, string | undefined>
    createdAt: Date
  },
) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  username: user.username,
  role: user.role,
  department: user.department,
  year: user.year,
  profilePhoto: user.profilePhoto,
  bio: user.bio,
  socialLinks: user.socialLinks,
  createdAt: user.createdAt,
  publishedArticles: [],
})

export const getPublicProfile = async (
  username: string,
) => {
  const normalizedUsername = username
    .trim()
    .toLowerCase()
  const currentUser = await User.findOne({
    username: normalizedUsername,
    isArchived: false,
  }).select(publicProfileProjection)

  if (currentUser) {
    return {
      profile: toPublicProfile(currentUser),
      redirectUsername: undefined,
    }
  }

  const historicalUsername =
    await UsernameHistory.findOne({
      username: normalizedUsername,
    })

  if (!historicalUsername) {
    return undefined
  }

  const user = await User.findOne({
    _id: historicalUsername.userId,
    isArchived: false,
  }).select(publicProfileProjection)

  if (!user) {
    return undefined
  }

  return {
    profile: toPublicProfile(user),
    redirectUsername: user.username,
  }
}

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
  const user = await User.findById(userId)

  if (!user || user.isArchived) {
    throw new Error('User account not found')
  }

  if (
    input.username &&
    input.username !== user.username
  ) {
    const existingUser = await User.findOne({
      username: input.username,
      _id: { $ne: user._id },
    })
    const existingHistory =
      await UsernameHistory.findOne({
        username: input.username,
      })

    if (existingUser || existingHistory) {
      throw new Error('This username is already taken')
    }

    await UsernameHistory.create({
      userId: user._id,
      username: user.username,
    })
  }

  Object.assign(user, input)
  await user.save()
  return user
}

export const archiveProfile = async (
  userId: string,
): Promise<void> => {
  const result = await User.updateOne(
    { _id: userId, isArchived: false },
    { $set: { isArchived: true } },
  )

  if (result.matchedCount === 0) {
    throw new Error('User account not found')
  }
}
