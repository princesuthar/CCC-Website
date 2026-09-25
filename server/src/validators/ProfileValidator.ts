import { z } from 'zod'

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must contain at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(
    /^[a-z0-9._]+$/,
    'Username can only contain lowercase letters, numbers, dots, and underscores',
  )

const socialLinksSchema = z
  .object({
    instagram: z.string().url().max(200).optional(),
    linkedin: z.string().url().max(200).optional(),
    github: z.string().url().max(200).optional(),
    website: z.string().url().max(200).optional(),
  })
  .optional()

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),
  username: usernameSchema.optional(),
  department: z.string().trim().min(2).max(100).optional(),
  year: z.number().int().min(1).max(6).optional(),
  bio: z.string().trim().max(500).optional(),
  profilePhoto: z.string().url().max(500).optional(),
  socialLinks: socialLinksSchema,
})

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>
