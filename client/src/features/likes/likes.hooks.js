import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toggleLike } from "./likes.api.js";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLike,

    onSuccess: async (_, postId) => {
      /*
      |--------------------------------------------------------------------------
      | Refetch the post details
      |--------------------------------------------------------------------------
      */

      await queryClient.invalidateQueries({
        queryKey: ["posts", "slug"],
      });

      /*
      | Also refresh post lists
      */

      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};