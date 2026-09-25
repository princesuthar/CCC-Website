import Article, {
  type ArticleCategory,
} from '../models/Article.js'
import ArticleVersion, {
  type ArticleVersionChange,
} from '../models/ArticleVersion.js'
import User from '../models/User.js'
import type { ArticleInput } from '../validators/ArticleValidator.js'

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const uniqueSlug = async (title: string, excludeId?: string) => {
  const base = toSlug(title)
  let slug = base
  let suffix = 2

  while (
    await Article.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${suffix}`
    suffix += 1
  }

  return slug
}

const articleProjection = {
  title: 1,
  slug: 1,
  excerpt: 1,
  content: 1,
  category: 1,
  tags: 1,
  status: 1,
  authorId: 1,
  publishedAt: 1,
  createdAt: 1,
  updatedAt: 1,
  reviewNote: 1,
  reviewedBy: 1,
  reviewedAt: 1,
}

const saveVersion = async (
  article: IArticleLike,
  changedBy: string,
  changeType: ArticleVersionChange,
) => {
  const articleId = String(article._id)
  const latest = await ArticleVersion.findOne({ articleId })
    .sort({ version: -1 })
    .select('version')
  await ArticleVersion.create({
    articleId,
    version: (Number((latest as { version?: number } | null)?.version) || 0) + 1,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    tags: article.tags,
    status: article.status,
    changedBy,
    changeType,
    reviewNote: article.reviewNote,
  })
}

type IArticleLike = {
  _id: unknown
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  status: string
  reviewNote?: string
}

export const createArticle = async (
  authorId: string,
  input: ArticleInput,
) => {
  const article = await Article.create({
    ...input,
    tags: [...new Set(input.tags.map((tag) => tag.toLowerCase()))],
    slug: await uniqueSlug(input.title),
    authorId,
  })
  await saveVersion(article, authorId, 'created')
  return article
}

export const listMyArticles = async (authorId: string) =>
  Article.find({ authorId, status: { $ne: 'archived' } })
    .select(articleProjection)
    .sort({ updatedAt: -1 })

export const updateArticle = async (
  authorId: string,
  articleId: string,
  input: Partial<ArticleInput>,
) => {
  const article = await Article.findOne({
    _id: articleId,
    authorId,
    status: 'draft',
  })

  if (!article) {
    throw new Error('Draft article not found')
  }

  if (input.title && input.title !== article.title) {
    article.slug = await uniqueSlug(input.title, article.id)
  }

  Object.assign(article, input)
  article.reviewNote = undefined
  if (input.tags) {
    article.tags = [
      ...new Set(input.tags.map((tag) => tag.toLowerCase())),
    ]
  }
  await article.save()
  await saveVersion(article, authorId, 'updated')
  return article
}

export const submitArticle = async (
  authorId: string,
  articleId: string,
) => {
  const article = await Article.findOneAndUpdate(
    { _id: articleId, authorId, status: 'draft' },
    { $set: { status: 'submitted' } },
    { new: true },
  )
  if (!article) {
    throw new Error('Draft article not found')
  }
  await saveVersion(article, authorId, 'submitted')
  return article
}

export const publishArticle = async (articleId: string, reviewerId?: string) => {
  const article = await Article.findOneAndUpdate(
    { _id: articleId, status: 'submitted' },
    {
      $set: {
        status: 'published',
        publishedAt: new Date(),
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
      $unset: { reviewNote: 1 },
    },
    { new: true },
  )
  if (!article) {
    throw new Error('Submitted article not found')
  }
  if (reviewerId) await saveVersion(article, reviewerId, 'approved')
  return article
}

export const rejectArticle = async (
  articleId: string,
  reviewerId: string,
  note: string,
) => {
  const article = await Article.findOneAndUpdate(
    { _id: articleId, status: 'submitted' },
    { $set: { status: 'draft', reviewNote: note, reviewedBy: reviewerId, reviewedAt: new Date() } },
    { new: true },
  )
  if (!article) throw new Error('Submitted article not found')
  await saveVersion(article, reviewerId, 'rejected')
  return article
}

export const listArticleVersions = async (articleId: string) =>
  ArticleVersion.find({ articleId })
    .sort({ version: -1 })
    .populate('changedBy', 'fullName username role')

export const listPublishedArticles = async (
  category?: ArticleCategory,
) => Article.find({
  status: 'published',
  ...(category ? { category } : {}),
})
  .select(articleProjection)
  .sort({ publishedAt: -1 })
  .limit(50)
  .populate('authorId', 'fullName username profilePhoto role')

export const getPublishedArticle = async (slug: string) =>
  Article.findOne({ slug, status: 'published' })
    .select(articleProjection)
    .populate('authorId', 'fullName username profilePhoto role')

export const listSubmittedArticles = async () =>
  Article.find({ status: 'submitted' })
    .select(articleProjection)
    .sort({ createdAt: 1 })
    .populate('authorId', 'fullName username profilePhoto role')

export const canCreateArticles = async (userId: string) => {
  const user = await User.findById(userId).select(
    'isEmailVerified isApproved isArchived role',
  )
  return Boolean(
    user &&
      user.isEmailVerified &&
      user.isApproved &&
      !user.isArchived &&
      (user.role === 'student' || user.role === 'teacher'),
  )
}
