export interface Post {
  id: string
  postVisibleId: number
  title: string
  preview: string
  body: Array<{
    content: string
    options: Record<string, unknown>
  }>
  authorInfo: {
    id: string
    displayName: string
    avatarUrl?: string
  }
  likesCount: number
  dislikesCount: number
  commentsCount: number
  createdOn: string
}

export interface Comment {
  id: string
  commentVisibleId: number
  body: string
  authorInfo: {
    id: string
    displayName: string
    avatarUrl?: string
  }
  likesCount: number
  dislikesCount: number
  repliesCount: number
  createdOn: string
  replies?: Comment[]
}

export interface UserProfile {
  id: string
  displayName: string
  email: string
  createdOn: string
  postsCount: number
  commentsCount: number
}

export interface PostsResponse {
  items: Post[]
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    displayName: string
  }
}
