import api from './api'

export interface EmailVerificationResponse {
  success: boolean
  message: string
}

export const verifyEmail = async (
  token: string,
): Promise<EmailVerificationResponse> => {
  const response =
    await api.get<EmailVerificationResponse>(
      '/auth/verify-email',
      { params: { token } },
    )

  return response.data
}

export const resendVerification = async (
  email: string,
): Promise<EmailVerificationResponse> => {
  const response =
    await api.post<EmailVerificationResponse>(
      '/auth/resend-verification',
      { email },
    )

  return response.data
}
