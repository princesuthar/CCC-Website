import assert from 'node:assert/strict'
import test from 'node:test'
import {
  hasRequiredRole,
  isUserRole,
} from './AuthMiddleware.js'

test('role middleware recognizes only supported roles', () => {
  assert.equal(isUserRole('student'), true)
  assert.equal(isUserRole('admin'), true)
  assert.equal(isUserRole('owner'), false)
})

test('role middleware accepts only explicitly allowed roles', () => {
  assert.equal(
    hasRequiredRole('reviewer', ['reviewer', 'admin']),
    true,
  )
  assert.equal(
    hasRequiredRole('student', ['reviewer', 'admin']),
    false,
  )
})
