# Article workflow API

All paths below are relative to `/api`. Authenticated endpoints use the
`accessToken` cookie. Dates are ISO-8601 strings.

## Common shapes

Successful responses always include `success: true`:

```json
{ "success": true, "article": { "...": "Article" } }
```

An article contains `_id`, `title`, `slug`, `excerpt`, `content`, `category`,
`tags`, `status` (`draft`, `submitted`, `published`, or `archived`),
`authorId`, `publishedAt`, `createdAt`, `updatedAt`, and optional
`reviewNote`, `reviewedBy`, and `reviewedAt`.

Validation and workflow errors use:

```json
{
  "success": false,
  "message": "Invalid article data",
  "errors": { "title": ["..."] }
}
```

## Author endpoints

| Method | Path | Role | Body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/articles/mine` | student, teacher | — | `{ success, articles: Article[] }` |
| `POST` | `/articles` | student, teacher | `title`, `excerpt`, `content`, `category`, `tags` | `201 { success, article }` |
| `PATCH` | `/articles/:articleId` | student, teacher | Any subset of article input fields | `{ success, article }` |
| `POST` | `/articles/:articleId/submit` | student, teacher | — | `{ success, article }` |
| `GET` | `/articles/:articleId/versions` | authenticated user | — | `{ success, versions: ArticleVersion[] }` |

Updates and submission are only allowed while the caller owns the article and
its status is `draft`. Submitting creates a version snapshot.

## Reviewer endpoints

| Method | Path | Role | Body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/articles/review/queue` | reviewer, admin | — | `{ success, articles: Article[] }` |
| `POST` | `/articles/:articleId/approve` | reviewer, admin | — | `{ success, article }` |
| `POST` | `/articles/:articleId/reject` | reviewer, admin | `{ "note": "..." }` | `{ success, article }` |

The queue contains submitted articles ordered oldest first. Approval changes
the status to `published`; rejection changes it back to `draft` and stores the
review note. `POST /articles/:articleId/publish` remains available as a
backwards-compatible alias for approval.

## Version shape

Each item in `versions` contains `_id`, `articleId`, `version`, the article
content fields, `status`, `changeType`, `reviewNote`, `changedBy` (with
`_id`, `fullName`, `username`, and `role`), and `createdAt`. Versions are
returned newest first.
