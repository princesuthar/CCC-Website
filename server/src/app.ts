import authRoutes from './routes/AuthRoutes.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/ErrorMiddleware.js'

const app = express()
app.use(helmet())
app.use(cookieParser())
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) =>
    req.method === 'GET' &&
    (req.path === '/me' ||
      req.path === '/verify-email'),
  message: {
    success: false,
    message: 'Too many authentication requests. Please try again later.',
  },
})

app.use('/api/auth', authRateLimiter, authRoutes)

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CCC API is running',
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

export default app