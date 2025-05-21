'use client'
import { IconTrendingUp } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { Album, Photo, Post, User, Totals } from "@/lib/types"
import { Loader2 } from 'lucide-react'


const fetchTotals = async (): Promise<Totals> => {
  const [postsData, albumsData, usersData, photosData] = await Promise.all([
    api.get(`posts`).then(({ data }) => data as Post[]),
    api.get(`albums`).then(({ data }) => data as Album[]),
    api.get(`users`).then(({ data }) => data as User[]),
    api.get(`photos`).then(({ data }) => data as Photo[]),
  ])
  return {
    posts: postsData.length,
    albums: albumsData.length,
    users: usersData.length,
    photos: photosData.length,
  }
}

export function SectionCards() {
  const { data, isLoading } = useQuery({ queryKey: ['totals'], queryFn: fetchTotals })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  const { posts: postCount = 0, albums: albumCount = 0, users: userCount = 0, photos: photoCount = 0 } = data || {}

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Posts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {postCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Posts increasing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total posts in the system
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Albums</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {albumCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Albums growing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total albums created
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {userCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            User base expanding <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total registered users
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Photos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {photoCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Photos uploaded <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total photos in gallery
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}