import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getPublishedArticle,
  type Article,
} from '../../services/ArticleService'

function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    void getPublishedArticle(slug)
      .then(setArticle)
      .catch(() => setError('Article not found'))
  }, [slug])

  if (error) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center">{error}</main>
  }
  if (!article) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center text-slate-500">Loading article...</main>
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <Link to="/articles" className="text-sm font-medium text-slate-500 hover:underline">
        ← All articles
      </Link>
      <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-slate-500">
        {article.category}
      </p>
      <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">{article.excerpt}</p>
      <p className="mt-5 text-sm text-slate-500">
        By {article.authorId?.fullName ?? 'CCC contributor'}
      </p>
      <div
        className="prose mt-10 max-w-none border-t border-slate-200 pt-10 text-lg leading-8 dark:border-slate-800"
        dangerouslySetInnerHTML={{ __html: article.content }}
      >
      </div>
    </main>
  )
}

export default ArticlePage
