import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import {
  completePasswordReset,
  forgotPassword,
  login,
  logout,
  register,
} from '../controllers/AuthController.js'

import { getCurrentUser } from '../controllers/UserController.js'
import {
  authorizeRoles,
  requireActiveUser,
  requireAuth,
} from '../middleware/AuthMiddleware.js'
import { getAuthorizationContext } from '../controllers/AuthorizationController.js'

import {
  resendVerification,
  verifyEmail,
} from '../controllers/EmailVerificationController.js'

const router = Router()
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many login attempts. Please try again later.',
  },
})
const registrationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many registration attempts. Please try again later.',
  },
})
const resendVerificationRateLimiter =
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message:
        'Too many verification requests. Please try again later.',
    },
  })

router.get(
  '/me',
  requireAuth,
  requireActiveUser,
  getCurrentUser,
)

router.get(
  '/authorization',
  requireAuth,
  requireActiveUser,
  getAuthorizationContext,
)

router.get(
  '/authorization/admin',
  requireAuth,
  requireActiveUser,
  authorizeRoles('admin'),
  getAuthorizationContext,
)

router.post(
  '/register',
  registrationRateLimiter,
  register,
)

router.post('/login', loginRateLimiter, login)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', completePasswordReset)

router.post('/logout', logout)

router.get('/verify-email', verifyEmail)

router.post(
  '/resend-verification',
  resendVerificationRateLimiter,
  resendVerification,
)

export default router