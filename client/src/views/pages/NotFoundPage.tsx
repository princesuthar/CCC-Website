import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-5 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          The page you requested does not exist.
        </p>
        <Link
          to="/"
          className="mt-7 inline-block rounded-lg bg-slate-950 px-5 py-3 font-medium text-white dark:bg-white dark:text-slate-950"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
