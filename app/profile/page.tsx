"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText, MessageSquare, Edit } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const router = useRouter()
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">
          {error ? "Failed to load profile" : "Profile not found"}
        </div>
      </div>
    )
  }

  const userInitial = profile.displayName?.charAt(0).toUpperCase() || "U"
  const memberSince = new Date(profile.createdOn).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-muted text-foreground text-3xl font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                    <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded">You</span>
                  </div>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 text-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {profile.postsCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Posts Created</div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 text-center">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {profile.commentsCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Comments Made</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-3">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Create New Post
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                View Feed
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Your Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">You haven't created any posts yet.</p>
              <p className="text-sm text-muted-foreground mb-6">Share your thoughts and ideas with the community!</p>
              <Button>Create Your First Post</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
