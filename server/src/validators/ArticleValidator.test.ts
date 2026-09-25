import test from 'node:test'
import assert from 'node:assert/strict'
import {
  articleInputSchema,
  articleUpdateSchema,
  articleReviewSchema,
} from './ArticleValidator.js'

const validArticle = {
  title: 'How students can build better study systems',
  excerpt: 'A practical guide to building consistent study habits on campus.',
  content: 'A'.repeat(50),
  category: 'Education' as const,
  tags: ['study', 'campus'],
}

test('article input accepts valid publication fields', () => {
  assert.equal(
    articleInputSchema.safeParse(validArticle).success,
    true,
  )
})

test('article input rejects short editorial content', () => {
  const result = articleInputSchema.safeParse({
    ...validArticle,
    content: 'Too short',
  })
  assert.equal(result.success, false)
})

test('article updates may change a subset of fields', () => {
  const result = articleUpdateSchema.safeParse({
    title: 'A revised title for the draft',
  })
  assert.equal(result.success, true)
})

test('review decisions require a useful note', () => {
  assert.equal(
    articleReviewSchema.safeParse({
      note: 'Please revise the sources.',
    }).success,
    true,
  )
  assert.equal(
    articleReviewSchema.safeParse({ note: '' }).success,
    false,
  )
})
