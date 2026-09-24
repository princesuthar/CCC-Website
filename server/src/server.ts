import dns from 'node:dns'

dns.setServers([
  '8.8.8.8',
  '1.1.1.1',
])


import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/database.js'
import { verifyEmailTransport } from './services/EmailService.js'
const PORT = process.env.PORT || 5000

const startServer = async (): Promise<void> => {
  await connectDatabase()
  await verifyEmailTransport()

  app.listen(PORT, () => {
    console.log(`CCC API server running on http://localhost:${PORT}`)
  })
}

startServer()