import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUserProfile,
  updateProfile,
  deleteAccount,
  getUsers,
  getUserById,
  changeUserRole,
} from "./users.api.js";

export const useUserProfile = (username) => {
  return useQuery({
    queryKey: ["users", "profile", username],

    queryFn: () => getUserProfile(username),

    enabled: Boolean(username),

    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);

      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,

    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      queryClient.removeQueries({
        queryKey: ["auth", "me"],
      });

      queryClient.removeQueries({
        queryKey: ["users"],
      });
    },
  });
};

//admin

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", "list", params],

    queryFn: () => getUsers(params),

    retry: false,
  });
};
export const useUserById = (id) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),

    retry: false,
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleData }) => changeUserRole(id, roleData),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
};
