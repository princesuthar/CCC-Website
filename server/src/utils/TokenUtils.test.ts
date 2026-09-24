import assert from 'node:assert/strict'
import test from 'node:test'
import {
  generateVerificationToken,
  hashToken,
} from './TokenUtils.js'

test('verification tokens are high-entropy hex values', () => {
  const token = generateVerificationToken()

  assert.match(token, /^[a-f0-9]{64}$/)
})

test('verification token hashing is deterministic and one-way shaped', () => {
  const token = generateVerificationToken()
  const hash = hashToken(token)

  assert.match(hash, /^[a-f0-9]{64}$/)
  assert.equal(hashToken(token), hash)
  assert.notEqual(hashToken(`${token}changed`), hash)
  assert.notEqual(hash, token)
})
