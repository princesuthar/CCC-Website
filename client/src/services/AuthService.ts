import api from './api'

export interface User {
  id: string
  fullName: string
  username: string
  email: string
  role: 'student' | 'teacher' | 'reviewer' | 'admin'
  department: string
  year?: number
  isEmailVerified: boolean
  isApproved: boolean
  isArchived: boolean
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  message: string
  user: User
}

export interface CurrentUserResponse {
  success: boolean
  user: User
}

export const login = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    data,
  )

  return response.data
}

export const requestPasswordReset = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(
    '/auth/forgot-password',
    { email },
  )
  return response.data
}

export const resetPassword = async (
  token: string,
  password: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(
    '/auth/reset-password',
    { token, password },
  )
  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const getCurrentUser =
  async (): Promise<CurrentUserResponse> => {
    const response =
      await api.get<CurrentUserResponse>(
        '/auth/me',
      )

    return response.data
  }