import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/AuthService'
import { getApiErrorMessage } from '../../utils/apiError'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
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
      const response = await resetPassword(token, password)
      setMessage(response.message)
    } catch (requestError: unknown) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to reset password.',
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
          Choose a new password
        </h1>
        {(message || error) && (
          <p className="mt-4 text-sm text-gray-600">
            {message || error}
          </p>
        )}
        <input
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          required
        />
        <button
          className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-60"
          disabled={isLoading || !token}
        >
          {isLoading ? 'Updating...' : 'Update password'}
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

export default ResetPasswordPage
