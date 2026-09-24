import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  resendVerification,
} from '../../services/EmailVerificationService'
import { getApiErrorMessage } from '../../utils/apiError'
import { useEmailVerificationViewModel } from '../../viewmodels/EmailVerificationViewModel'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')
  const [isResending, setIsResending] = useState(false)

  const {
    isLoading,
    isVerified,
    message,
  } = useEmailVerificationViewModel(token)

  const handleResend = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setIsResending(true)
    setResendMessage('')
    setResendError('')

    try {
      const response = await resendVerification(email)
      setResendMessage(response.message)
    } catch (error: unknown) {
      setResendError(
        getApiErrorMessage(
          error,
          'Unable to resend verification email.',
        ),
      )
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Verifying your email...
          </h1>

          <p className="mt-2 text-gray-500">
            Please wait while we verify your college email address.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          {isVerified
            ? 'Email Verified'
            : 'Verification Failed'}
        </h1>

        <p className="mt-4 text-gray-600">
          {message}
        </p>

        {isVerified && (
          <p className="mt-4 text-sm text-gray-500">
            Your college email has been successfully verified.
          </p>
        )}

        {!isVerified && (
          <form
            onSubmit={handleResend}
            className="mt-6 space-y-3 text-left"
          >
            <label
              htmlFor="verification-email"
              className="block text-sm font-medium text-gray-700"
            >
              Resend verification email
            </label>
            <input
              id="verification-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="yourname@vcet.edu.in"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
            {(resendMessage || resendError) && (
              <p className="text-sm text-gray-600">
                {resendMessage || resendError}
              </p>
            )}
            <button
              type="submit"
              disabled={isResending}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-60"
            >
              {isResending
                ? 'Sending...'
                : 'Resend verification email'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default VerifyEmailPage