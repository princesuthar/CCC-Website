import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ARTICLE_CATEGORIES,
  createArticle,
  listMyArticles,
  updateArticle,
  type ArticleCategory,
} from '../../services/ArticleService'
import { getApiErrorMessage } from '../../utils/apiError'
import RichTextEditor from '../components/RichTextEditor'

function ArticleEditorPage() {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<ArticleCategory>('Technology')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!articleId) return
    void listMyArticles().then((articles) => {
      const article = articles.find((item) => item._id === articleId)
      if (!article) return
      setTitle(article.title)
      setExcerpt(article.excerpt)
      setContent(article.content)
      setCategory(article.category)
      setTags(article.tags.join(', '))
    }).catch(() => setError('Unable to load this draft'))
  }, [articleId])

  const saveDraft = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      const input = {
        title,
        excerpt,
        content,
        category,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      }
      const article = articleId
        ? await updateArticle(articleId, input)
        : await createArticle(input)
      navigate(`/dashboard?article=${article._id}`)
    } catch (requestError: unknown) {
      setError(getApiErrorMessage(requestError, 'Unable to save draft'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">{articleId ? 'Edit draft' : 'New article'}</p>
      <h1 className="mt-2 text-4xl font-bold">{articleId ? 'Refine your article' : 'Write for CCC'}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Save a draft, refine your idea, and submit it for editorial review.
      </p>
      <form onSubmit={saveDraft} className="mt-10 space-y-5">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input required minLength={5} maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Article title" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-lg dark:border-slate-700 dark:bg-slate-900" />
        <textarea required minLength={20} maxLength={320} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="Short excerpt" rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
        <div className="grid gap-5 sm:grid-cols-2">
          <select value={category} onChange={(event) => setCategory(event.target.value as ArticleCategory)} className="rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            {ARTICLE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" className="rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Article content</p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <button disabled={isSaving} className="rounded-lg bg-slate-950 px-5 py-3 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">
          {isSaving ? 'Saving...' : 'Save draft'}
        </button>
      </form>
    </main>
  )
}

export default ArticleEditorPage
