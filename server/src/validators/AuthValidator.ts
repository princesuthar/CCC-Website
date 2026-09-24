import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must contain at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters'),

    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, 'Username must contain at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        /^[a-z0-9._]+$/,
        'Username can only contain lowercase letters, numbers, dots, and underscores',
      ),

    email: z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .refine(
    (email: string) => email.endsWith('@vcet.edu.in'),
    'Only VCET college email addresses are allowed',
  ),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),

    role: z.enum(['student', 'teacher']),

    collegeId: z.string().trim().optional(),

    facultyId: z.string().trim().optional(),

    department: z
      .string()
      .trim()
      .min(2, 'Department is required'),

    year: z
      .number()
      .int()
      .min(1)
      .max(6)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'student' && !data.collegeId) {
      ctx.addIssue({
        code: 'custom',
        path: ['collegeId'],
        message: 'College/Student ID is required for students',
      })
    }

    if (data.role === 'teacher' && !data.facultyId) {
      ctx.addIssue({
        code: 'custom',
        path: ['facultyId'],
        message: 'Faculty/Employee ID is required for teachers',
      })
    }

    if (data.role === 'student' && !data.year) {
      ctx.addIssue({
        code: 'custom',
        path: ['year'],
        message: 'Year is required for students',
      })
    }
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address')
    .refine(
      (email: string) => email.endsWith('@vcet.edu.in'),
      'Only VCET college email addresses are allowed',
    ),
})

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
})