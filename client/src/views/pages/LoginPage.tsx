import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthViewModel } from '../../viewmodels/AuthViewModel'

function LoginPage() {
  const navigate = useNavigate()

  const {
    loginUser,
    isLoading,
    error,
  } = useAuthViewModel()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const success = await loginUser(
      email,
      password,
      rememberMe,
    )

    if (success) {
      navigate('/')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500">
            Login to Core Coding Committee
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              College Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="yourname@vcet.edu.in"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? 'Logging in...'
              : 'Login'}
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
            />
            Remember me for 30 days
          </label>
        </form>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="mt-4 block w-full text-center text-sm font-medium text-gray-700 hover:underline"
        >
          Forgot password?
        </button>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium text-gray-900 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  )
}

export default LoginPage