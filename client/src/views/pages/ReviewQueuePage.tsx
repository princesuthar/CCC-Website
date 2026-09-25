import { useEffect, useState } from 'react'
import {
  approveArticle,
  listSubmittedArticles,
  rejectArticle,
  type Article,
} from '../../services/ArticleService'

function ReviewQueuePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState('')
  const [note, setNote] = useState<Record<string, string>>({})

  const loadQueue = () => {
    void listSubmittedArticles()
      .then(setArticles)
      .catch(() => setError('Unable to load the review queue'))
  }

  useEffect(loadQueue, [])

  const approve = async (articleId: string) => {
    try {
      await approveArticle(articleId)
      setArticles((current) => current.filter((item) => item._id !== articleId))
    } catch {
      setError('Unable to approve this article')
    }
  }

  const reject = async (articleId: string) => {
    const reviewNote = note[articleId]?.trim()
    if (!reviewNote) {
      setError('Add a review note before rejecting an article')
      return
    }
    try {
      await rejectArticle(articleId, reviewNote)
      setArticles((current) => current.filter((item) => item._id !== articleId))
    } catch {
      setError('Unable to return this article to the author')
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Editorial workspace</p>
      <h1 className="mt-2 text-4xl font-bold">Review queue</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Read submitted articles and decide whether they are ready for publication.
      </p>
      {error && <p className="mt-8 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-10 space-y-6">
        {articles.length === 0 && !error && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-slate-500 dark:border-slate-700">
            The review queue is empty.
          </p>
        )}
        {articles.map((article) => (
          <article key={article._id} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{article.category}</p>
            <h2 className="mt-3 text-2xl font-bold">{article.title}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{article.excerpt}</p>
            <div className="mt-5 whitespace-pre-wrap border-t border-slate-200 pt-5 leading-7 dark:border-slate-800">
              {article.content}
            </div>
            <p className="mt-5 text-sm text-slate-500">
              By {article.authorId?.fullName ?? 'CCC contributor'}
            </p>
            <textarea
              value={note[article._id] ?? ''}
              onChange={(event) => setNote((current) => ({ ...current, [article._id]: event.target.value }))}
              placeholder="Review note required only when returning the article"
              rows={2}
              className="mt-5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => void approve(article._id)} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-950">
                Approve and publish
              </button>
              <button type="button" onClick={() => void reject(article._id)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-700">
                Return to author
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ReviewQueuePage
