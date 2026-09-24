import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestPasswordReset } from '../../services/AuthService'
import { getApiErrorMessage } from '../../utils/apiError'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await requestPasswordReset(email)
      setMessage(response.message)
    } catch (requestError: unknown) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to request password reset.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Reset password
        </h1>
        <p className="mt-2 text-gray-500">
          Enter your VCET email to receive a reset link.
        </p>
        {(message || error) && (
          <p className="mt-4 text-sm text-gray-600">
            {message || error}
          </p>
        )}
        <input
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="yourname@vcet.edu.in"
          required
        />
        <button
          className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-4 w-full text-sm hover:underline"
        >
          Back to login
        </button>
      </form>
    </main>
  )
}

export default ForgotPasswordPage
