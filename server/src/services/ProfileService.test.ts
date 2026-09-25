import assert from 'node:assert/strict'
import test from 'node:test'
import { toPublicProfile } from './ProfileService.js'

test('public profile projection excludes private identity fields', () => {
  const profile = toPublicProfile({
    _id: { toString: () => 'user-id' },
    fullName: 'Student Name',
    username: 'student.name',
    role: 'student',
    department: 'Computer Engineering',
    year: 2,
    bio: 'Writer',
    createdAt: new Date('2026-01-01'),
  })

  assert.equal(profile.id, 'user-id')
  assert.equal(profile.username, 'student.name')
  assert.equal('email' in profile, false)
  assert.equal('collegeId' in profile, false)
  assert.deepEqual(profile.publishedArticles, [])
})
