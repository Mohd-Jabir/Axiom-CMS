import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.api.js";
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
};
export const useCategoryBySlug = (slug) => {
  return useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", "slug"],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", "id", variables.id],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};
