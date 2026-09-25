import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ARTICLE_CATEGORIES,
  listPublishedArticles,
  type Article,
  type ArticleCategory,
} from '../../services/ArticleService'

function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState<ArticleCategory | ''>('')
  const [error, setError] = useState('')

  useEffect(() => {
    void listPublishedArticles(category || undefined)
      .then(setArticles)
      .catch(() => setError('Unable to load published articles'))
  }, [category])

  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Publication
          </p>
          <h1 className="mt-2 text-4xl font-bold">Explore articles</h1>
        </div>
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as ArticleCategory | '')
          }
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All topics</option>
          {ARTICLE_CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {error && <p className="mt-10 text-red-600">{error}</p>}
      {!error && articles.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-slate-500 dark:border-slate-700">
          No published articles yet.
        </p>
      )}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/articles/${article.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-6 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {article.category}
            </span>
            <h2 className="mt-4 text-xl font-bold">{article.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {article.excerpt}
            </p>
            <p className="mt-6 text-sm text-slate-500">
              {article.authorId?.fullName ?? 'CCC contributor'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default ArticlesPage
