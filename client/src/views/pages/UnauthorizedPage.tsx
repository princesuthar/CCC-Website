import { useNavigate } from 'react-router-dom'

function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Access denied
        </h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to access this page.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white"
        >
          Return home
        </button>
      </div>
    </main>
  )
}

export default UnauthorizedPage
