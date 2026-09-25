import { Schema, model, type Document, type Types } from 'mongoose'
import type { ArticleCategory } from './Article.js'

export type ArticleVersionChange =
  | 'created'
  | 'updated'
  | 'submitted'
  | 'approved'
  | 'rejected'

export interface IArticleVersion extends Document {
  articleId: Types.ObjectId
  version: number
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  status: string
  changedBy: Types.ObjectId
  changeType: ArticleVersionChange
  reviewNote?: string
  createdAt: Date
}

const articleVersionSchema = new Schema<IArticleVersion>(
  {
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    version: { type: Number, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    status: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changeType: { type: String, enum: ['created', 'updated', 'submitted', 'approved', 'rejected'], required: true },
    reviewNote: { type: String, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

articleVersionSchema.index({ articleId: 1, version: 1 }, { unique: true })

export default model<IArticleVersion>('ArticleVersion', articleVersionSchema)
