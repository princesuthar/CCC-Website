import nodemailer from 'nodemailer'

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export const verifyEmailTransport = async (): Promise<void> => {
  await emailTransporter.verify()

  console.log('SMTP connection verified successfully')
}

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
): Promise<void> => {
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`

  const info = await emailTransporter.sendMail({
    from: `"Core Coding Committee" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your Core Coding Committee account',
    text: `
Welcome to Core Coding Committee!

Please verify your college email address by opening this link:

${verificationUrl}

This verification link will expire in 15 minutes.

If you did not create this account, you can safely ignore this email.
    `.trim(),
  })

  console.log('Verification email sent:', info.messageId)
}