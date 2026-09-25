import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/AuthStore'
import {
  listMyArticles,
  submitArticle,
  type Article,
} from '../../services/ArticleService'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void listMyArticles()
      .then(setArticles)
      .catch(() => setError('Unable to load your articles'))
  }, [])

  const submit = async (articleId: string) => {
    try {
      const updated = await submitArticle(articleId)
      setArticles((current) =>
        current.map((article) =>
          article._id === updated._id ? updated : article,
        ),
      )
    } catch {
      setError('Unable to submit this article')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Author workspace
          </p>
          <h1 className="mt-2 text-4xl font-bold">{user?.role} dashboard</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Draft, refine, and submit your campus writing for review.
          </p>
        </div>
        <Link
          to="/articles/new"
          className="rounded-lg bg-slate-950 px-5 py-3 text-center font-medium text-white dark:bg-white dark:text-slate-950"
        >
          New article
        </Link>
      </div>
      {error && <p className="mt-8 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Your articles</h2>
        {articles.length === 0 && !error && (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-8 text-slate-500 dark:border-slate-700">
            You have no drafts yet.
          </p>
        )}
        <div className="mt-4 space-y-3">
          {articles.map((article) => (
            <div key={article._id} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="font-semibold">{article.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {article.category} · {article.status}
                </p>
              </div>
              <div className="flex gap-2">
                {article.status === 'draft' && (
                  <>
                    <Link to={`/articles/edit/${article._id}`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
                      Edit
                    </Link>
                    <button type="button" onClick={() => void submit(article._id)} className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-white dark:bg-white dark:text-slate-950">
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
