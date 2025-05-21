"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "@/lib/types";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

async function fetchPosts(page: number, search: string = ""): Promise<{ posts: Post[]; hasMore: boolean }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const response = await api.get(`posts?_page=${page}&_limit=5${search ? `&q=${search}` : ""}`);
    const posts = response.data || [];
    const totalCount = Number(response.headers["x-total-count"] || 100);
    const hasMore = posts.length > 0 && page * 5 < totalCount;
    return { posts, hasMore };
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname === "/admin/posts";

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: () => fetchPosts(page, search),
    staleTime: 0,
  });

  useEffect(() => {
    if (data?.posts) {
      setAllPosts((prev) => {
        const newPosts = data.posts.filter(
          (newPost) => !prev.some((existingPost) => existingPost.id === newPost.id)
        );
        return [...prev, ...newPosts];
      });
      setHasMore(data.hasMore);
    }
  }, [data]);

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    setAllPosts([]);
  };

  const handleDelete = async (id: number | undefined) => {
    try {
      await api.delete(`posts/${id}`);
      setAllPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
      <div className="max-w-2xl mx-auto space-y-4 w-full">
        <h1 className="text-center text-2xl font-bold">Posts</h1>
        <Input
          type="text"
          placeholder="Search posts by title..."
          value={search}
          onChange={handleSearch}
          className="mb-4"
        />
        <InfiniteScroll
          dataLength={allPosts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            isLoading && (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full rounded-md bg-gray-300" />
                ))}
              </div>
            )
          }
          endMessage={
            allPosts.length > 0 && !hasMore && (
              <div className="text-center text-gray-500">
                No more posts to load
              </div>
            )
          }
        >
          {allPosts?.map((post) => (
            <Card key={post.id} className="bg-white m-2 shadow-md hover:shadow-lg transition-shadow relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </CardTitle>
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/admin/post/manage/${post.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.body}</p>
              </CardContent>
            </Card>
          ))}
        </InfiniteScroll>

        {error && (
          <div className="text-center text-red-500">
            Error loading posts: {error.message}
            <Button onClick={() => setPage((prev) => prev + 1)} className="ml-4">
              Retry
            </Button>
          </div>
        )}

        {allPosts.length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-500">
            No posts available
          </div>
        )}
      </div>
  );
}