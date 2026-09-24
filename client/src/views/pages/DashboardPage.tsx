import { useAuthStore } from '../../stores/AuthStore'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role} dashboard
        </h1>
        <p className="mt-3 text-gray-600">
          Your authenticated workspace is ready for the next CCC feature
          phases.
        </p>
      </div>
    </main>
  )
}

export default DashboardPage
