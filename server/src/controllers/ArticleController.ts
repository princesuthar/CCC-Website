import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/AuthMiddleware.js'
import {
  articleInputSchema,
  articleUpdateSchema,
  articleReviewSchema,
} from '../validators/ArticleValidator.js'
import {
  canCreateArticles,
  createArticle,
  getPublishedArticle,
  listMyArticles,
  listPublishedArticles,
  listSubmittedArticles,
  publishArticle,
  submitArticle,
  updateArticle,
  rejectArticle,
  listArticleVersions,
} from '../services/ArticleService.js'
import {
  ARTICLE_CATEGORIES,
  type ArticleCategory,
} from '../models/Article.js'

const invalid = (res: Response, errors: unknown) => {
  res.status(400).json({
    success: false,
    message: 'Invalid article data',
    errors,
  })
}

export const getArticles = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const requestedCategory =
    typeof req.query.category === 'string'
      ? req.query.category
      : undefined
  const category = ARTICLE_CATEGORIES.includes(
    requestedCategory as ArticleCategory,
  )
    ? requestedCategory as ArticleCategory
    : undefined
  res.json({
    success: true,
    articles: await listPublishedArticles(category),
  })
}

export const getArticle = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const article = await getPublishedArticle(req.params.slug as string)
  if (!article) {
    res.status(404).json({ success: false, message: 'Article not found' })
    return
  }
  res.json({ success: true, article })
}

export const createArticleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!(await canCreateArticles(req.user!.userId))) {
    res.status(403).json({
      success: false,
      message: 'Only verified and approved authors can create articles',
    })
    return
  }
  const result = articleInputSchema.safeParse(req.body)
  if (!result.success) {
    invalid(res, result.error.flatten().fieldErrors)
    return
  }
  const article = await createArticle(req.user!.userId, result.data)
  res.status(201).json({ success: true, article })
}

export const getMyArticles = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  res.json({
    success: true,
    articles: await listMyArticles(req.user!.userId),
  })
}

export const updateArticleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = articleUpdateSchema.safeParse(req.body)
  if (!result.success) {
    invalid(res, result.error.flatten().fieldErrors)
    return
  }
  try {
    const article = await updateArticle(
      req.user!.userId,
      req.params.articleId as string,
      result.data,
    )
    res.json({ success: true, article })
  } catch (error) {
    if (error instanceof Error && error.message === 'Draft article not found') {
      res.status(404).json({ success: false, message: error.message })
      return
    }
    throw error
  }
}

export const submitArticleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const article = await submitArticle(
      req.user!.userId,
      req.params.articleId as string,
    )
    res.json({ success: true, article })
  } catch (error) {
    if (error instanceof Error && error.message === 'Draft article not found') {
      res.status(404).json({ success: false, message: error.message })
      return
    }
    throw error
  }
}

export const getSubmittedArticles = async (
  _req: AuthenticatedRequest,
  res: Response,
) => {
  res.json({ success: true, articles: await listSubmittedArticles() })
}

export const getArticleVersions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const versions = await listArticleVersions(req.params.articleId as string)
  res.json({ success: true, versions })
}

export const publishArticleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const article = await publishArticle(req.params.articleId as string, req.user!.userId)
    res.json({ success: true, article })
  } catch (error) {
    if (error instanceof Error && error.message === 'Submitted article not found') {
      res.status(404).json({ success: false, message: error.message })
      return
    }
    throw error
  }
}

export const rejectArticleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const result = articleReviewSchema.safeParse(req.body)
  if (!result.success) {
    invalid(res, result.error.flatten().fieldErrors)
    return
  }
  try {
    const article = await rejectArticle(
      req.params.articleId as string,
      req.user!.userId,
      result.data.note,
    )
    res.json({ success: true, article })
  } catch (error) {
    if (error instanceof Error && error.message === 'Submitted article not found') {
      res.status(404).json({ success: false, message: error.message })
      return
    }
    throw error
  }
}
