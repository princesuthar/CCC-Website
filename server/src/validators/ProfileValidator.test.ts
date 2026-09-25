import assert from 'node:assert/strict'
import test from 'node:test'
import { updateProfileSchema } from './ProfileValidator.js'

test('profile updates normalize usernames', () => {
  const result = updateProfileSchema.safeParse({
    username: 'New.Writer',
    bio: 'A short bio',
  })

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.username, 'new.writer')
  }
})

test('profile updates reject invalid usernames and links', () => {
  const result = updateProfileSchema.safeParse({
    username: 'bad username',
    socialLinks: {
      github: 'not-a-url',
    },
  })

  assert.equal(result.success, false)
})
