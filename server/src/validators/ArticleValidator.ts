import { z } from 'zod'
import { ARTICLE_CATEGORIES } from '../models/Article.js'

const tagsSchema = z.array(
  z.string().trim().min(1).max(30),
).max(8).default([])

export const articleInputSchema = z.object({
  title: z.string().trim().min(5).max(160),
  excerpt: z.string().trim().min(20).max(320),
  content: z.string().trim().min(50).max(100000),
  category: z.enum(ARTICLE_CATEGORIES),
  tags: tagsSchema,
})

export const articleUpdateSchema = articleInputSchema.partial()

export const articleReviewSchema = z.object({
  note: z.string().trim().min(1).max(1000),
})

export type ArticleInput = z.infer<typeof articleInputSchema>
