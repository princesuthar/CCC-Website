import api from './api'

export interface RegisterRequest {
  fullName: string
  username: string
  email: string
  password: string
  role: 'student' | 'teacher'
  collegeId?: string
  facultyId?: string
  department: string
  year?: number
}

export interface RegisterResponse {
  success: boolean
  message: string
  user: {
    id: string
    fullName: string
    username: string
    email: string
    role: 'student' | 'teacher'
    department: string
    year?: number
    isEmailVerified: boolean
    isApproved: boolean
  }
}

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response =
    await api.post<RegisterResponse>(
      '/auth/register',
      data,
    )

  return response.data
}