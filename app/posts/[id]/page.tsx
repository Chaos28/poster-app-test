import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, MessageCircle, CornerDownRight } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface Post {
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

interface Comment {
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

async function getPost(postVisibleId: string): Promise<Post | null> {
  try {
    const response = await fetch(`/api/social/posts/${postVisibleId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error("Failed to fetch post")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching post:", error)
    return null
  }
}

async function getComments(postVisibleId: string): Promise<Comment[]> {
  try {
    console.log("[v0] Fetching comments for post ID:", postVisibleId)

    const response = await fetch(`/api/social/posts/${postVisibleId}/comments`, {
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Failed to fetch comments: ${response.status}`, errorText)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching comments:", error)
    return []
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  )
}

function PostSkeleton() {
  return (
    <Card className="mb-8">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

function CommentsSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={`${isReply ? "ml-12 mt-4" : ""}`}>
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage
                src={comment.authorInfo.avatarUrl || "/placeholder.svg"}
                alt={comment.authorInfo.displayName}
              />
              <AvatarFallback>{comment.authorInfo.displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <p className="font-semibold">{comment.authorInfo.displayName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(comment.createdOn)}</p>
              </div>
              <p className="text-sm leading-relaxed">{comment.body}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{comment.likesCount}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{comment.dislikesCount}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <CornerDownRight className="h-4 w-4" />
                  <span>Reply</span>
                </button>
                {comment.repliesCount > 0 && !isReply && (
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>
                      Hide {comment.repliesCount} {comment.repliesCount === 1 ? "reply" : "replies"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )
}

async function PostContent({ postId }: { postId: string }) {
  const post = await getPost(postId)

  if (!post) {
    notFound()
  }

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.authorInfo.avatarUrl || "/placeholder.svg"} alt={post.authorInfo.displayName} />
            <AvatarFallback>{post.authorInfo.displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.authorInfo.displayName}</p>
            <p className="text-sm text-muted-foreground">{formatDate(post.createdOn)}</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-balance leading-tight">{post.title}</h1>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {post.body.map((block, index) => (
            <p key={index} className="mb-4 leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm font-medium">{post.likesCount}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ThumbsDown className="h-5 w-5" />
            <span className="text-sm font-medium">{post.dislikesCount}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function CommentsSection({ postId }: { postId: string }) {
  const comments = await getComments(postId)

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea placeholder="Add a comment..." className="min-h-[100px] resize-none" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">0/500 characters</p>
              <Button variant="secondary">Post Comment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}

export const revalidate = 0

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <article className="mx-auto max-w-3xl">
          <Suspense fallback={<PostSkeleton />}>
            <PostContent postId={params.id} />
          </Suspense>

          <Suspense fallback={<CommentsSkeleton />}>
            <CommentsSection postId={params.id} />
          </Suspense>
        </article>
      </main>
    </div>
  )
}
