import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/AuthStore'

function ProtectedRoute() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  )

  if (!isInitialized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading your session...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
