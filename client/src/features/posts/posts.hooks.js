import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  archivePost,
  getMyPosts,
  getPostById,
} from "./posts.api.js";

/*
|--------------------------------------------------------------------------
| GET ALL POSTS
|--------------------------------------------------------------------------
*/

export const usePosts = (params = {}) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
  });
};

/*
|--------------------------------------------------------------------------
| GET POST BY SLUG
|--------------------------------------------------------------------------
*/

export const usePostBySlug = (slug) => {
  return useQuery({
    queryKey: ["posts", "slug", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
  });
};

/*
|--------------------------------------------------------------------------
| CREATE POST
|--------------------------------------------------------------------------
*/

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| UPDATE POST
|--------------------------------------------------------------------------
*/

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "slug"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "id", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "me"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| DELETE POST
|--------------------------------------------------------------------------
*/

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "me"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| PUBLISH POST
|--------------------------------------------------------------------------
*/

export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "me"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| ARCHIVE POST
|--------------------------------------------------------------------------
*/

export const useArchivePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archivePost,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", "me"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| GET MY POSTS
|--------------------------------------------------------------------------
*/
export const useMyPosts = (params = {}) => {
  return useQuery({
    queryKey: ["posts", "me", params],
    queryFn: () => getMyPosts(params),
    enabled: Boolean(localStorage.getItem("accessToken")),
    staleTime: 0,
    refetchOnMount: true,
  });
};

/*
|--------------------------------------------------------------------------
| GET POST BY ID
|--------------------------------------------------------------------------
*/

export const usePostById = (id) => {
  return useQuery({
    queryKey: ["posts", "id", id],
    queryFn: () => getPostById(id),
    enabled: Boolean(id),
  });
};
