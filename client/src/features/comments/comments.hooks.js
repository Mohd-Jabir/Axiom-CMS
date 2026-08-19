import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getComments, createComment, deleteComment } from "./comments.api.js";

/*
|--------------------------------------------------------------------------
| GET COMMENTS
|--------------------------------------------------------------------------
*/

export const useComments = (postId, params = {}) => {
  return useQuery({
    queryKey: ["comments", postId, params],
    queryFn: () => getComments(postId, params),
    enabled: Boolean(postId),
  });
};

/*
|--------------------------------------------------------------------------
| CREATE COMMENT
|--------------------------------------------------------------------------
*/

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });

      // Refresh post data if it contains commentsCount
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| DELETE COMMENT
|--------------------------------------------------------------------------
*/

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      // Refresh post data if it contains commentsCount
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};
