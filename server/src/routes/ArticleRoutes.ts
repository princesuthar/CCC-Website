import { Router } from 'express'
import {
  authorizeRoles,
  requireActiveUser,
  requireAuth,
} from '../middleware/AuthMiddleware.js'
import {
  createArticleController,
  getArticle,
  getArticles,
  getMyArticles,
  getSubmittedArticles,
  publishArticleController,
  rejectArticleController,
  getArticleVersions,
  submitArticleController,
  updateArticleController,
} from '../controllers/ArticleController.js'

const router = Router()

router.get('/', getArticles)
router.get('/published/:slug', getArticle)

router.use(requireAuth, requireActiveUser)
router.get('/mine', authorizeRoles('student', 'teacher'), getMyArticles)
router.post(
  '/',
  authorizeRoles('student', 'teacher'),
  createArticleController,
)
router.patch(
  '/:articleId',
  authorizeRoles('student', 'teacher'),
  updateArticleController,
)
router.post(
  '/:articleId/submit',
  authorizeRoles('student', 'teacher'),
  submitArticleController,
)
router.get(
  '/:articleId/versions',
  authorizeRoles('student', 'teacher', 'reviewer', 'admin'),
  getArticleVersions,
)
router.get(
  '/submitted',
  authorizeRoles('reviewer', 'admin'),
  getSubmittedArticles,
)
router.get(
  '/review/queue',
  authorizeRoles('reviewer', 'admin'),
  getSubmittedArticles,
)
router.post(
  '/:articleId/publish',
  authorizeRoles('reviewer', 'admin'),
  publishArticleController,
)
router.post(
  '/:articleId/approve',
  authorizeRoles('reviewer', 'admin'),
  publishArticleController,
)
router.post(
  '/:articleId/reject',
  authorizeRoles('reviewer', 'admin'),
  rejectArticleController,
)

export default router
