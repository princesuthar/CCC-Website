import { useState } from 'react'
import {
  register,
  type RegisterRequest,
  type RegisterResponse,
} from '../services/RegistrationService'

export const useRegistrationViewModel = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] =
    useState<RegisterResponse | null>(null)

  const registerUser = async (
    data: RegisterRequest,
  ): Promise<boolean> => {
    setIsLoading(true)
    setError('')
    setResponse(null)

    try {
      const result = await register(data)

      setResponse(result)

      return true
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string
            }
          }
        }

        setError(
          axiosError.response?.data?.message ||
            'Registration failed',
        )
      } else {
        setError('Registration failed')
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    response,
    registerUser,
  }
}
