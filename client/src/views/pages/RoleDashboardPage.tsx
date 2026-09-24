import type { User } from '../../services/AuthService'
import { useAuthStore } from '../../stores/AuthStore'

interface RoleDashboardPageProps {
  role: User['role']
}

function RoleDashboardPage({
  role,
}: RoleDashboardPageProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Authorized workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {role} dashboard
        </h1>
        <p className="mt-3 text-gray-600">
          Signed in as {user?.fullName}. Role-specific CCC features will be
          added in their domain phases.
        </p>
      </div>
    </main>
  )
}

export default RoleDashboardPage
