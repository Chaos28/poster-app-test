import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Post, PostsResponse, Comment } from '@/lib/types'

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const data = await apiClient.get<PostsResponse>('/social/posts')
      return data.items || []
    },
  })
}

export const usePost = (postVisibleId: string) => {
  return useQuery({
    queryKey: ['post', postVisibleId],
    queryFn: () => apiClient.get<Post>(`/social/posts/${postVisibleId}`),
    enabled: !!postVisibleId,
  })
}

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => apiClient.get<Comment[]>(`/social/posts/${postId}/comments`),
    enabled: !!postId,
  })
}
