import { appViewModel } from '../../viewmodels/AppViewModel'

function HomePage() {
  const app = appViewModel()

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          {app.applicationName}
        </h1>

        <p className="mt-2 text-gray-600">
          College Publication Platform
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Version {app.version}
        </p>
      </div>
    </main>
  )
}

export default HomePage