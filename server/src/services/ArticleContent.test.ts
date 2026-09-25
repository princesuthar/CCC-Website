import assert from 'node:assert/strict'
import test from 'node:test'
import { sanitizeArticleContent } from './ArticleService.js'

test('article content keeps supported formatting', () => {
  const content = sanitizeArticleContent(
    '<h2>Heading</h2><p><strong>Useful</strong> writing</p>',
  )

  assert.match(content, /<h2>Heading<\/h2>/)
  assert.match(content, /<strong>Useful<\/strong>/)
})

test('article content removes executable markup and attributes', () => {
  const content = sanitizeArticleContent(
    '<p onclick="alert(1)">Safe</p><script>alert(2)</script><a href="javascript:alert(3)">Link</a>',
  )

  assert.equal(content.includes('<script'), false)
  assert.equal(content.includes('onclick'), false)
  assert.equal(content.includes('javascript:'), false)
  assert.match(content, /<p>Safe<\/p>/)
})
