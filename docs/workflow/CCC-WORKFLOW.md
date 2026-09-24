# CCC Development Workflow

## 1. Project vision

Core Coding Committee (CCC) is a college publication platform for students and
teachers to publish, review, discover, and discuss approved articles across
technology, academics, campus life, culture, science, and other approved
topics.

## 2. Technology stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios,
  Zustand, React Hook Form, and Zod
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, HTTP-only
  cookies, bcryptjs, Zod, and transactional email
- Infrastructure: GitHub, MongoDB Atlas, Brevo, and Cloudinary

## 3. Architecture

The frontend is being organized around MVVM:

- `client/src/models`
- `client/src/views`
- `client/src/viewmodels`
- `client/src/services`
- `client/src/stores`
- `client/src/routes`

The backend uses layered responsibilities:

- `server/src/controllers`
- `server/src/services`
- `server/src/models`
- `server/src/routes`
- `server/src/middleware`
- `server/src/validators`
- `server/src/utils`

The current repository is an early implementation and still needs the broader
article-platform layers.

## 4. Completed phases

### Phase 0 - Repository audit

Completed on 2026-09-24. The current implementation and gaps were inspected,
and this workflow document was updated without replacing the existing
architecture.

## 5. Current phase

### Phase 1 - Authentication stabilization

Implementation complete on 2026-09-24. Database-backed lifecycle validation
remains an environment-dependent verification task and is documented below.

### Phase 2 - Authorization

Implementation complete on 2026-09-24. Backend role validation, active-user
checks, authorization context, and frontend protected/role-gated route
boundaries are implemented. Domain-specific protected endpoints will be added
with their corresponding profile, article, review, and admin phases.

## 6. Completed features

### Existing backend

- MongoDB connection helper
- `User` model with student, teacher, reviewer, and admin role values
- `EmailVerificationToken` model with SHA-256 token hashes and expiry index
- Student and teacher registration endpoint
- `@vcet.edu.in` registration validation
- bcrypt password hashing
- Login and logout endpoints
- JWT generation in an HTTP-only cookie
- Authentication middleware
- `/api/auth/me`
- Initial email verification and resend endpoints
- Brevo transactional email client and environment-based sender configuration
- Password reset request/completion endpoints with hashed, expiring tokens
- Remember Me support with 30-day JWT/cookie lifetime; default sessions use
  one-day lifetime
- Frontend resend-verification flow with endpoint-specific rate limiting
- Centralized 404 and error responses that do not expose server internals
- Typed `requireAuth` and reusable `authorizeRoles` backend middleware
- Supported-role validation for JWT claims
- Frontend protected routes and role-gated routes with unauthorized handling
- Active-user lookup prevents archived users and stale JWT roles from accessing
  protected resources
- Authorization context endpoint exposes server-derived capabilities

### Existing frontend

- Vite React TypeScript application
- Initial MVVM folders and home page
- Axios service configured with credentials
- Zustand auth store
- Authentication, registration, and email-verification view models
- Login, registration, and verification pages
- Routes for `/`, `/login`, `/register`, and `/verify-email`

## 7. Remaining phases

1. Authentication stabilization
2. Authorization
3. User and public profile system
4. Application layout and design system
5. Categories and tags
6. Article core and TipTap editor
7. Article versioning
8. Review system
9. Publishing
10. Homepage and discovery
11. Social features
12. Admin dashboard
13. Analytics
14. Security hardening
15. Testing
16. Production preparation
17. Final QA

## 8. Important decisions

- Authentication tokens remain in HTTP-only cookies and are never stored in
  browser local storage.
- Email delivery is abstracted behind `EmailService`; Brevo is the production
  provider and credentials are read only from server environment variables.
- College registration is restricted to `@vcet.edu.in`.
- Teacher accounts require administrator approval after email verification.
- Existing uncommitted auth work is treated as in-progress project work and is
  preserved while it is stabilized.

## 9. Known issues

- Full registration and verification lifecycle tests are still outstanding;
  token utility tests now run with the server test script.
- Full database-backed lifecycle tests remain outstanding.
- Domain-specific business endpoints are not implemented yet.
- The public profile, article, review, publishing, discovery, social, admin,
  and analytics systems are not implemented.
- No root-level `.env.example` exists; server placeholders need to include all
  production integrations.

## 10. Testing status

Token, JWT, registration-validation, email-validation, and
password-reset-validation tests run through the server test script: eight tests
pass. Full database-backed registration, verification, resend, reset, and
provider-failure lifecycle tests require a configured test MongoDB and remain
outstanding. Server and client TypeScript/build checks pass.

## 11. Deployment status

Not deployment-ready. Local environment placeholders exist in
`server/.env.example`; production Brevo, Cloudinary, MongoDB Atlas, CORS, and
cookie configuration still need to be completed and documented.

## 12. Security status

Implemented: bcrypt password hashing, JWT verification, HTTP-only auth cookie,
basic CORS credentials, input validation for registration, token hashing, token
expiry, Brevo configuration validation, Helmet, and authentication rate
limiting. Password reset tokens are hashed, expiring, and single-use, and reset
requests do not reveal account existence.

Implemented: centralized fallback 404 and error middleware, in addition to
Helmet and authentication rate limiting. Outstanding: authorization
middleware, upload validation, audit logging, and security testing.
Verification resend has a stricter endpoint limiter and generic account
responses.

## 13. Documentation status

The workflow baseline is complete. Additional architecture, authentication,
API, testing, security, and deployment documentation will be added alongside
their implemented phases.

## Phase 1 stabilization report

**Status:** Implementation complete; database integration validation pending  
**Implemented:** Raw verification tokens are no longer returned from
registration; failed Brevo delivery cleans up the new user/token; failed
resends remove the replacement token; verification links use `CLIENT_URL`;
`/api/auth/me` returns the current user without its password; and the client
uses the configured Axios API instead of hardcoded localhost.  
**Security:** Added Helmet and an authentication rate limiter.  
**Testing:** Eight server tests pass; server and client builds pass.
Database-backed lifecycle tests are pending and must run against a dedicated
test database before production deployment.  
**Next:** Configure isolated integration-test infrastructure, execute the
registration-to-verification and reset flows, then begin Phase 2
authorization.

## Phase 2 authorization report

**Status:** Implementation complete  
**Implemented:** Role-safe JWT claims, reusable backend role middleware,
active-user and archived-account checks, student/teacher/reviewer/admin
authorization context, frontend session-initialization loading, authenticated
route protection, role-specific route gates, admin gating, and an unauthorized
page.  
**Tests:** Twelve server tests pass; server and client builds pass.  
**Next:** Implement Phase 3 profiles on top of these authorization boundaries.
