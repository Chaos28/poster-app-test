import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import type { SignInRequest, SignUpRequest, AuthResponse } from '@/lib/types'

export const useSignIn = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignInRequest) =>
      apiClient.post<AuthResponse>('/auth/session', data),
    onSuccess: (response) => {
      // Save auth data to localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userFullName', response.user.displayName)
      localStorage.setItem('userEmail', response.user.email)
      localStorage.setItem('userId', response.user.id)

      router.push('/')
    },
  })
}

export const useSignUp = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: SignUpRequest) =>
      apiClient.post<AuthResponse>('/auth/users', data),
    onSuccess: (response) => {
      // Save auth data to localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userFullName', response.user.displayName)
      localStorage.setItem('userEmail', response.user.email)
      localStorage.setItem('userId', response.user.id)

      router.push('/')
    },
  })
}
