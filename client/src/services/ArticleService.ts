import api from './api'

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
export type ArticleStatus =
  | 'draft'
  | 'submitted'
  | 'published'
  | 'archived'

export interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  status: ArticleStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
  reviewNote?: string
  reviewedBy?: string
  reviewedAt?: string
  authorId?: {
    fullName: string
    username: string
    profilePhoto?: string
  }
}

export type ArticleVersionChange =
  | 'created'
  | 'updated'
  | 'submitted'
  | 'approved'
  | 'rejected'

export interface ArticleVersion {
  _id: string
  articleId: string
  version: number
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  status: ArticleStatus
  changeType: ArticleVersionChange
  reviewNote?: string
  changedBy: {
    _id: string
    fullName: string
    username: string
    role: string
  }
  createdAt: string
}

export type ArticleInput = Omit<
  Article,
  | '_id'
  | 'slug'
  | 'status'
  | 'publishedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'authorId'
> & { tags: string[] }

export const listPublishedArticles = async (
  category?: ArticleCategory,
) => {
  const response = await api.get<{ articles: Article[] }>(
    '/articles',
    { params: category ? { category } : undefined },
  )
  return response.data.articles
}

export const getPublishedArticle = async (slug: string) => {
  const response = await api.get<{ article: Article }>(
    `/articles/published/${encodeURIComponent(slug)}`,
  )
  return response.data.article
}

export const listMyArticles = async () => {
  const response = await api.get<{ articles: Article[] }>(
    '/articles/mine',
  )
  return response.data.articles
}

export const createArticle = async (input: ArticleInput) => {
  const response = await api.post<{ article: Article }>(
    '/articles',
    input,
  )
  return response.data.article
}

export const updateArticle = async (
  articleId: string,
  input: Partial<ArticleInput>,
) => {
  const response = await api.patch<{ article: Article }>(
    `/articles/${articleId}`,
    input,
  )
  return response.data.article
}

export const submitArticle = async (articleId: string) => {
  const response = await api.post<{ article: Article }>(
    `/articles/${articleId}/submit`,
  )
  return response.data.article
}

export const listSubmittedArticles = async () => {
  const response = await api.get<{ articles: Article[] }>(
    '/articles/review/queue',
  )
  return response.data.articles
}

export const approveArticle = async (articleId: string) => {
  const response = await api.post<{ article: Article }>(
    `/articles/${articleId}/approve`,
  )
  return response.data.article
}

export const rejectArticle = async (articleId: string, note: string) => {
  const response = await api.post<{ article: Article }>(
    `/articles/${articleId}/reject`,
    { note },
  )
  return response.data.article
}

export const listArticleVersions = async (articleId: string) => {
  const response = await api.get<{ versions: ArticleVersion[] }>(
    `/articles/${articleId}/versions`,
  )
  return response.data.versions
}
