# Email provider decision

CCC uses Brevo transactional email for production instead of Gmail SMTP.
The backend reads `BREVO_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, and
`CLIENT_URL` from the server environment. `EmailService` is the provider
boundary so authentication workflows do not construct provider clients
directly.

Only verification-token hashes are stored. A provider failure during
registration is treated as a failed registration and removes the newly
created user and token.
