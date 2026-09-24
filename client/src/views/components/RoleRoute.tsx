import { Navigate, Outlet } from 'react-router-dom'
import type { User } from '../../services/AuthService'
import { useAuthStore } from '../../stores/AuthStore'

interface RoleRouteProps {
  allowedRoles: User['role'][]
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
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
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleRoute
