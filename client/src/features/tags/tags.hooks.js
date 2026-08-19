import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
} from "./tags.api.js";

export const useTags = (params = {}) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => getTags(params),
  });
};

/*
|--------------------------------------------------------------------------
| GET TAG BY SLUG
|--------------------------------------------------------------------------
*/

export const useTagBySlug = (slug) => {
  return useQuery({
    queryKey: ["tags", "slug", slug],
    queryFn: () => getTagBySlug(slug),
    enabled: Boolean(slug),
  });
};

/*
|--------------------------------------------------------------------------
| CREATE TAG
|--------------------------------------------------------------------------
*/

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| UPDATE TAG
|--------------------------------------------------------------------------
*/

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTag,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tags", "slug"],
      });

      // If you later have a getTagById query
      queryClient.invalidateQueries({
        queryKey: ["tags", "id", variables.id],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| DELETE TAG
|--------------------------------------------------------------------------
*/

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
};
