import assert from 'node:assert/strict'
import test from 'node:test'
import {
  emailSchema,
  registerSchema,
  resetPasswordSchema,
} from './AuthValidator.js'

test('registration requires VCET student fields', () => {
  const result = registerSchema.safeParse({
    fullName: 'Student Name',
    username: 'student.name',
    email: 'student@vcet.edu.in',
    password: 'password123',
    role: 'student',
    department: 'Computer Engineering',
  })

  assert.equal(result.success, false)
})

test('registration rejects non-college email addresses', () => {
  const result = registerSchema.safeParse({
    fullName: 'Student Name',
    username: 'student.name',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    collegeId: 'VCET001',
    department: 'Computer Engineering',
    year: 2,
  })

  assert.equal(result.success, false)
})

test('password reset validation requires a strong password', () => {
  assert.equal(
    resetPasswordSchema.safeParse({
      token: 'reset-token',
      password: 'short',
    }).success,
    false,
  )
})

test('email validation normalizes valid college emails', () => {
  const result = emailSchema.safeParse({
    email: 'Student@VCET.EDU.IN',
  })

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.email, 'student@vcet.edu.in')
  }
})
