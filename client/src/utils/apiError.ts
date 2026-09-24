import axios from 'axios'

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message

    if (typeof message === 'string' && message) {
      return message
    }
  }

  return error instanceof Error
    ? error.message
    : fallback
}
