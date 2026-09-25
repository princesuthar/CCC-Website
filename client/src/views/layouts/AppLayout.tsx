import { Link, Outlet } from 'react-router-dom'
import { useAuthViewModel } from '../../viewmodels/AuthViewModel'
import { useThemeStore } from '../../stores/ThemeStore'

function AppLayout() {
  const { user, logoutUser } = useAuthViewModel()
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
              C3
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">
                CORE CODING COMMITTEE
              </span>
              <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                The VCET publication platform
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 sm:inline-block dark:hover:bg-slate-900"
            >
              Explore
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/u/${user.username}`}
                  className="hidden rounded-lg px-3 py-2 hover:bg-slate-100 md:inline-block dark:hover:bg-slate-900"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => void logoutUser()}
                  className="rounded-lg border border-slate-300 px-3 py-2 font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Sign in
              </Link>
            )}
            <button
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={toggleTheme}
              className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </nav>
        </div>
      </header>

      <div className="min-h-[calc(100vh-137px)]">
        <Outlet />
      </div>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <p>© {new Date().getFullYear()} Core Coding Committee</p>
          <p>Read. Write. Contribute.</p>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
