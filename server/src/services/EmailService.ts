import { BrevoClient } from '@getbrevo/brevo'

const getEmailConfig = (): {
  apiKey: string
  fromEmail: string
  fromName: string
  clientUrl: string
} => {
  const apiKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.EMAIL_FROM
  const clientUrl = process.env.CLIENT_URL

  if (!apiKey || !fromEmail || !clientUrl) {
    throw new Error(
      'Brevo email configuration is incomplete',
    )
  }

  let parsedClientUrl: URL
  try {
    parsedClientUrl = new URL(clientUrl)
  } catch {
    throw new Error('CLIENT_URL must be a valid URL')
  }

  if (
    parsedClientUrl.protocol !== 'http:' &&
    parsedClientUrl.protocol !== 'https:'
  ) {
    throw new Error(
      'CLIENT_URL must use http or https',
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    throw new Error('EMAIL_FROM must be a valid email address')
  }

  return {
    apiKey,
    fromEmail,
    fromName:
      process.env.EMAIL_FROM_NAME ||
      'Core Coding Committee',
    clientUrl,
  }
}

const getBrevoClient = (): BrevoClient => {
  const { apiKey } = getEmailConfig()

  return new BrevoClient({
    apiKey,
    timeoutInSeconds: 30,
    maxRetries: 2,
  })
}

export const verifyEmailTransport = async (): Promise<void> => {
  getEmailConfig()
}

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
): Promise<void> => {
  const { fromEmail, fromName, clientUrl } =
    getEmailConfig()
  const verificationUrl =
    `${clientUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`

  await getBrevoClient().transactionalEmails.sendTransacEmail(
    {
      sender: {
        email: fromEmail,
        name: fromName,
      },
      to: [{ email }],
      subject:
        'Verify your Core Coding Committee account',
      textContent: [
        'Welcome to Core Coding Committee!',
        '',
        'Please verify your college email address by opening this link:',
        '',
        verificationUrl,
        '',
        'This verification link will expire in 15 minutes.',
        '',
        'If you did not create this account, you can safely ignore this email.',
      ].join('\n'),
    },
  )
}

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  const { fromEmail, fromName, clientUrl } =
    getEmailConfig()
  const resetUrl =
    `${clientUrl}/reset-password?token=${encodeURIComponent(resetToken)}`

  await getBrevoClient().transactionalEmails.sendTransacEmail(
    {
      sender: {
        email: fromEmail,
        name: fromName,
      },
      to: [{ email }],
      subject: 'Reset your Core Coding Committee password',
      textContent: [
        'A password reset was requested for your Core Coding Committee account.',
        '',
        'Reset your password by opening this link:',
        '',
        resetUrl,
        '',
        'This link will expire in 15 minutes.',
        'If you did not request this, you can safely ignore this email.',
      ].join('\n'),
    },
  )
}
