import { Router } from 'express'
import { register } from '../controllers/AuthController.js'
import { verifyEmail } from '../controllers/EmailVerificationController.js'

const router = Router()

router.post('/register', register)
router.get('/verify-email', verifyEmail)

export default router