import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { UserProfile } from '@/lib/types'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.get<UserProfile>('/social/userprofiles/me'),
    retry: false,
  })
}
