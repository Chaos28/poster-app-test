"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PostCard } from "@/components/post-card"
import { usePosts } from "@/hooks/use-posts"
import { Skeleton } from "@/components/ui/skeleton"

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

function PostsSkeleton() {
	return (
		<div className="grid gap-6">
			{[1, 2, 3].map((i) => (
				<div key={i} className="rounded-lg border border-border bg-card p-6 space-y-4">
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-24" />
						</div>
					</div>
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			))}
		</div>
	)
}

export default function HomePage() {
	const { data: posts, isLoading, error } = usePosts()

	return (
		<div className="min-h-screen">
			<Header />
			<HeroSection />

			<main className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl">
					<h2 className="mb-6 text-2xl font-bold">Post Feed</h2>

					{isLoading ? (
						<PostsSkeleton />
					) : error ? (
						<div className="rounded-lg border border-border bg-card p-8 text-center">
							<p className="text-destructive">
								Failed to load posts. Please try again later.
							</p>
						</div>
					) : !posts || posts.length === 0 ? (
						<div className="rounded-lg border border-border bg-card p-8 text-center">
							<p className="text-muted-foreground">
								No posts available at the moment.
							</p>
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
