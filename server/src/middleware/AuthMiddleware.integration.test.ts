import assert from 'node:assert/strict'
import test from 'node:test'
import { hasRequiredRole } from './AuthMiddleware.js'

test('student and teacher authorizations are separate from reviewer/admin', () => {
  assert.equal(
    hasRequiredRole('student', ['student', 'teacher']),
    true,
  )
  assert.equal(
    hasRequiredRole('teacher', ['student', 'teacher']),
    true,
  )
  assert.equal(
    hasRequiredRole('reviewer', ['student', 'teacher']),
    false,
  )
  assert.equal(
    hasRequiredRole('admin', ['student', 'teacher']),
    false,
  )
})

test('reviewer and admin permissions are explicit', () => {
  assert.equal(
    hasRequiredRole('reviewer', ['reviewer']),
    true,
  )
  assert.equal(
    hasRequiredRole('admin', ['admin']),
    true,
  )
  assert.equal(
    hasRequiredRole('reviewer', ['admin']),
    false,
  )
})
