import authRoutes from './routes/AuthRoutes.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CCC API is running',
  })
})

export default app