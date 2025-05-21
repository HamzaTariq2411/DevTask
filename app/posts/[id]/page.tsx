"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

async function fetchPost(id: number): Promise<Post> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await api.get(`/posts/${id}`);
    return response.data || {};
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(Number(id)),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 flex-col">
      <h1 className="text-center text-2xl font-bold">Post Detail</h1>
      <div className="max-w-3xl w-full mx-auto py-8 space-y-6">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-lg bg-gray-200" />
            <Skeleton className="h-48 w-full rounded-lg bg-gray-200" />
            <Skeleton className="h-10 w-32 rounded-lg bg-gray-200" />
          </div>
        )}
        {error && (
          <Card className="bg-white shadow-lg border border-red-100">
            <CardContent className="text-center p-8 space-y-4">
              <p className="text-red-600 text-lg font-medium">
                Error loading post: {error.message}
              </p>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
        {post && (
          <Card className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-gray-700 text-lg leading-8 font-serif">
                {post.body}
              </p>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />Go Back
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}