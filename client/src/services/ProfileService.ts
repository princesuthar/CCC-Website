import api from './api'
import type { User } from './AuthService'

export interface PublicProfile {
  id: string
  fullName: string
  username: string
  role: User['role']
  department: string
  year?: number
  profilePhoto?: string
  bio?: string
  socialLinks?: User['socialLinks']
  createdAt: string
  publishedArticles: unknown[]
}

export type ProfileUpdate = Partial<
  Pick<
    User,
    | 'fullName'
    | 'username'
    | 'department'
    | 'year'
    | 'profilePhoto'
    | 'bio'
    | 'socialLinks'
  >
>

export const getPublicProfile = async (
  username: string,
): Promise<PublicProfile> => {
  const response = await api.get<{
    success: boolean
    profile: PublicProfile
  }>(`/profiles/u/${encodeURIComponent(username)}`)
  return response.data.profile
}

export const updateProfile = async (
  input: ProfileUpdate,
): Promise<void> => {
  await api.patch('/profiles/me', input)
}

export const uploadProfilePhoto = async (
  photo: File,
): Promise<string> => {
  const formData = new FormData()
  formData.append('photo', photo)
  const response = await api.post<{
    success: boolean
    profilePhoto: string
  }>('/profiles/me/photo', formData)
  return response.data.profilePhoto
}

export const archiveProfile = async (): Promise<void> => {
  await api.post('/profiles/me/archive')
}
