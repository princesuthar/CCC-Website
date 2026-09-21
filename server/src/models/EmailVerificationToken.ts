import { Schema, model, type Document, type Types } from 'mongoose'

export interface IEmailVerificationToken extends Document {
  userId: Types.ObjectId
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}

const emailVerificationTokenSchema =
  new Schema<IEmailVerificationToken>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    },
  )

emailVerificationTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
)

const EmailVerificationToken =
  model<IEmailVerificationToken>(
    'EmailVerificationToken',
    emailVerificationTokenSchema,
  )

export default EmailVerificationToken