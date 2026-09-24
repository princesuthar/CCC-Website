import { useState } from 'react'
import {
  getCurrentUser,
  login,
  logout,
} from '../services/AuthService'
import { useAuthStore } from '../stores/AuthStore'
import { getApiErrorMessage } from '../utils/apiError'

export const useAuthViewModel = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore(
    (state) => state.clearUser,
  )
  const setInitialized = useAuthStore(
    (state) => state.setInitialized,
  )

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] = useState('')

  const loginUser = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<boolean> => {
    setIsLoading(true)
    setError('')

    try {
      const response = await login({
        email,
        password,
        rememberMe,
      })

      setUser(response.user)

      return true
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(error, 'Login failed'),
      )

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logoutUser = async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      await logout()
      clearUser()
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(error, 'Logout failed'),
      )
    } finally {
      setIsLoading(false)
    }
  }

const loadCurrentUser =
  async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getCurrentUser()

      setUser(response.user)
    } catch {
      clearUser()
    } finally {
      setIsLoading(false)
      setInitialized()
    }
  }

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    loginUser,
    logoutUser,
    loadCurrentUser,
  }
}