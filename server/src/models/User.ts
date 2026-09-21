import { Schema, model, type Document } from 'mongoose'

export type UserRole = 'student' | 'teacher' | 'reviewer' | 'admin'

export interface IUser extends Document {
  fullName: string
  username: string
  email: string
  password: string

  role: UserRole

  collegeId?: string
  facultyId?: string

  department: string
  year?: number

  profilePhoto?: string
  bio?: string

  socialLinks?: {
    instagram?: string
    linkedin?: string
    github?: string
    website?: string
  }

  isEmailVerified: boolean
  isApproved: boolean
  isArchived: boolean

  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ['student', 'teacher', 'reviewer', 'admin'],
      required: true,
    },

    collegeId: {
      type: String,
      trim: true,
    },

    facultyId: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 6,
    },

    profilePhoto: {
      type: String,
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    socialLinks: {
      instagram: String,
      linkedin: String,
      github: String,
      website: String,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const User = model<IUser>('User', userSchema)

export default User