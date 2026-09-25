import { Schema, model, type Document, type Types } from 'mongoose'

export interface IUsernameHistory extends Document {
  userId: Types.ObjectId
  username: string
  changedAt: Date
}

const usernameHistorySchema =
  new Schema<IUsernameHistory>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
    },
    { versionKey: false },
  )

const UsernameHistory = model<IUsernameHistory>(
  'UsernameHistory',
  usernameHistorySchema,
)

export default UsernameHistory
