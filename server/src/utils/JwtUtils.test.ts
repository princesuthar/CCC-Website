import assert from 'node:assert/strict'
import test from 'node:test'
import jwt from 'jsonwebtoken'
import {
  generateAccessToken,
} from './JwtUtils.js'

test('access tokens use the configured default lifetime', () => {
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '1d'

  const token = generateAccessToken(
    'user-id',
    'student',
  )
  const payload = jwt.decode(token)

  assert.ok(payload && typeof payload !== 'string')
  assert.equal(payload.userId, 'user-id')
  assert.equal(payload.role, 'student')
  assert.equal(payload.exp! - payload.iat!, 86400)
})

test('remember-me access tokens use a thirty-day lifetime', () => {
  process.env.JWT_SECRET = 'test-secret'

  const token = generateAccessToken(
    'user-id',
    'student',
    true,
  )
  const payload = jwt.decode(token)

  assert.ok(payload && typeof payload !== 'string')
  assert.equal(payload.exp! - payload.iat!, 30 * 86400)
})
