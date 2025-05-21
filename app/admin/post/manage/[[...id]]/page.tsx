'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Post } from '@/lib/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false });

const fetchPost = async (id: string) => {
  const { data } = await api.get(`posts/${id}`);
  return data;
};

const createPost = async (post: Post) => {
  const { data } = await api.post('posts', post);
  return data;
};

const updatePost = async (post: Post) => {
  const { data } = await api.put(`posts/${post.id}`, post);
  return data;
};

const RichTextEditor: React.FC = () => {
  const params = useParams();
    const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const isUpdateMode = !!id;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: isUpdateMode,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Failed to create post. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Post updated successfully!');
      router.push('/admin/posts');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update post. Please try again.');
    },
  });

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  useEffect(() => {
    if (isUpdateMode && post) {
      setTitle(post.title);
      setContent(post.body);
    }
  }, [isUpdateMode, post]);

  const handleSave = () => {
    if (!title || !content) {
      toast.error('Please enter both a title and content.');
      return;
    }
    const postData: Post = {
      userId: 1,
      title,
      body: content,
      ...(isUpdateMode && { id: Number(id) }),
    };
    if (isUpdateMode) {
      updateMutation.mutate(postData);
    } else {
      createMutation.mutate(postData);
    }
  };

  if (isLoading && isUpdateMode) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading post: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">
        {isUpdateMode ? 'Edit Post' : 'Create Post'}
      </h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <QuillEditor content={content} setContent={setContent} initialContent={post?.body} />
      <button
        onClick={handleSave}
        disabled={createMutation.isPending || updateMutation.isPending}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {createMutation.isPending || updateMutation.isPending
          ? 'Saving...'
          : isUpdateMode
          ? 'Update'
          : 'Create'}
      </button>
    </div>
  );
};

export default RichTextEditor;