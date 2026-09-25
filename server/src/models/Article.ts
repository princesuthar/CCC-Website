import { Schema, model, type Document, type Types } from 'mongoose'

export type ArticleStatus =
  | 'draft'
  | 'submitted'
  | 'published'
  | 'archived'

export const ARTICLE_CATEGORIES = [
  'Technology',
  'AI & ML',
  'Cybersecurity',
  'Education',
  'Academics',
  'Campus Life',
  'College News',
  'Innovation',
  'Career',
  'Science',
  'Arts & Culture',
  'Gaming',
  'Environment',
  'Opinion',
  'Photography',
  'Other',
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]

export interface IArticle extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  status: ArticleStatus
  authorId: Types.ObjectId
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  reviewNote?: string
  reviewedBy?: Types.ObjectId
  reviewedAt?: Date
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true, maxlength: 100000 },
    category: {
      type: String,
      enum: ARTICLE_CATEGORIES,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 8,
        message: 'Articles can have at most eight tags',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    publishedAt: Date,
    reviewNote: { type: String, trim: true, maxlength: 1000 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
  },
  { timestamps: true },
)

const Article = model<IArticle>('Article', articleSchema)

export default Article
