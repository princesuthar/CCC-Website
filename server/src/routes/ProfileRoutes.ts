import { Router } from 'express'
import {
  archiveCurrentProfile,
  getProfile,
  updateCurrentProfile,
} from '../controllers/ProfileController.js'
import {
  requireActiveUser,
  requireAuth,
} from '../middleware/AuthMiddleware.js'
import multer from 'multer'
import { uploadCurrentProfilePhoto } from '../controllers/ProfileController.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(
      null,
      ['image/jpeg', 'image/png', 'image/webp'].includes(
        file.mimetype,
      ),
    )
  },
})

router.get('/u/:username', getProfile)

router.patch(
  '/me',
  requireAuth,
  requireActiveUser,
  updateCurrentProfile,
)

router.post(
  '/me/archive',
  requireAuth,
  requireActiveUser,
  archiveCurrentProfile,
)

router.post(
  '/me/photo',
  requireAuth,
  requireActiveUser,
  upload.single('photo'),
  uploadCurrentProfilePhoto,
)

export default router
