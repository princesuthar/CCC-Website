import { useEffect, useRef, useState } from 'react'
import { verifyEmail } from '../services/EmailVerificationService'
import { getApiErrorMessage } from '../utils/apiError'

interface EmailVerificationState {
  isLoading: boolean
  isVerified: boolean
  message: string
}

export const useEmailVerificationViewModel = (
  token: string | null,
): EmailVerificationState => {
  const [state, setState] =
    useState<EmailVerificationState>({
      isLoading: true,
      isVerified: false,
      message: '',
    })
  const verificationAttempt = useRef<string | null>(
    null,
  )

  useEffect(() => {
    if (
      token &&
      verificationAttempt.current === token
    ) {
      return
    }

    verificationAttempt.current = token

    const verify = async () => {
      if (!token) {
        setState({
          isLoading: false,
          isVerified: false,
          message: 'Verification token is missing.',
        })

        return
      }

      try {
        const response = await verifyEmail(token)

        setState({
          isLoading: false,
          isVerified: response.success,
          message: response.message,
        })
      } catch (error: unknown) {
        setState({
          isLoading: false,
          isVerified: false,
          message: getApiErrorMessage(
            error,
            'Email verification failed.',
          ),
        })
      }
    }

    void verify()
  }, [token])

  return state
}