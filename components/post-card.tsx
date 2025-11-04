import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface PostCardProps {
  id: number
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  createdAt: string
}

export function PostCard({ id, title, description, author, createdAt }: PostCardProps) {
  // Truncate description to 150 characters
  const truncatedDescription = description.length > 150 ? `${description.slice(0, 150)}...` : description

  return (
    <Link href={`/posts/${id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{author.name}</p>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="text-xl font-semibold text-balance leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{truncatedDescription}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
