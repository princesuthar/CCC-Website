import mongoose from 'mongoose'

const CONNECTION_ATTEMPTS = 3
const RETRY_DELAY_MS = 2_000

const wait = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined')
  }

  for (
    let attempt = 1;
    attempt <= CONNECTION_ATTEMPTS;
    attempt += 1
  ) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5_000,
      })

      console.log('MongoDB connected successfully')
      return
    } catch (error) {
      if (attempt === CONNECTION_ATTEMPTS) {
        console.error(
          'MongoDB connection failed after retries:',
          error instanceof Error
            ? error.message
            : 'Unknown database connection error',
        )
        process.exit(1)
      }

      console.error(
        `MongoDB connection attempt ${attempt} failed; retrying...`,
        error instanceof Error ? error.message : error,
      )
      await wait(RETRY_DELAY_MS)
    }
  }
}