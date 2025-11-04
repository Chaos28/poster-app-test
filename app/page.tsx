import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PostCard } from "@/components/post-card"

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

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch("/api/social/posts", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await response.json()

    if (data && Array.isArray(data.items)) {
      return data.items
    } else {
      console.error("[v0] Unexpected API response format:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
}

export const revalidate = 0

export default async function HomePage() {
  const posts = await getPosts()
  console.log("AAAA", posts)
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold">Post Feed</h2>
          {!posts || posts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No posts available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.postVisibleId}
                  title={post.title}
                  description={post.preview}
                  author={{
                    name: post.authorInfo.displayName,
                    avatar: post.authorInfo.avatarUrl || "/diverse-user-avatars.png",
                  }}
                  createdAt={formatDate(post.createdOn)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
